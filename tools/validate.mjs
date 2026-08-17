#!/usr/bin/env node
/**
 * AI Concept Atlas — local validation script.
 *
 * Zero dependencies. Run from the repository root:
 *   node tools/validate.mjs           offline checks only (this runs in CI)
 *   node tools/validate.mjs --links   also HEAD every primary reference URL
 *
 * --links is opt-in because it makes 71 network requests and third-party
 * publishers occasionally rate-limit or block automated requests; a failure
 * there means "worth a look", not necessarily "broken".
 *
 * Exit code 0 = all checks passed, 1 = at least one check failed.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(join(ROOT, file), "utf8");
const CHECK_LINKS = process.argv.includes("--links");

let failures = 0;
let warnings = 0;

const ok = (message) => console.log(`  ✓ ${message}`);
const fail = (message) => { failures += 1; console.error(`  ✗ ${message}`); };
const warn = (message) => { warnings += 1; console.warn(`  ! ${message}`); };
const section = (title) => console.log(`\n${title}`);

/* ------------------------------------------------------------------ */
/* 1. Required files                                                    */
/* ------------------------------------------------------------------ */
section("Repository layout");

const REQUIRED_FILES = [
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "math-data.js",
  "i18n.js",
  "data-fr.js",
  "math-data-fr.js",
  "quiz.js",
  "tools-data.js",
  "tools-data-fr.js",
  "README.md",
  "LICENSE",
  "CLAUDE.md",
  ".gitignore",
  ".github/workflows/pages.yml",
  "assets/favicon.svg",
  "assets/ai-concept-map.svg",
  "assets/ai-concept-map.png",
  "assets/ai-atlas.ico",
  "tools/build-map.mjs",
  "tools/create-shortcut.ps1"
];

for (const file of REQUIRED_FILES) {
  if (existsSync(join(ROOT, file))) ok(`${file} present`);
  else fail(`${file} is missing`);
}

/* ------------------------------------------------------------------ */
/* 2. JavaScript syntax + concept data model                            */
/* ------------------------------------------------------------------ */
section("JavaScript syntax");

const sandbox = { window: {}, document: undefined, history: undefined, location: undefined };
vm.createContext(sandbox);

let concepts = [];
let categories = [];
let mathConcepts = [];
let mathCategories = [];
let conceptsFr = {};
let categoriesFr = {};
let mathConceptsFr = {};
let mathCategoriesFr = {};
let i18nStrings = {};
let quizApi = null;
let tools = [];
let toolCategories = [];
let toolsFr = {};
let toolCategoriesFr = {};

try {
  new vm.Script(read("data.js"), { filename: "data.js" }).runInContext(sandbox);
  concepts = sandbox.window.AI_CONCEPTS ?? [];
  categories = sandbox.window.AI_CATEGORIES ?? [];
  ok("data.js parses and evaluates");
} catch (error) {
  fail(`data.js failed to evaluate: ${error.message}`);
}

try {
  new vm.Script(read("math-data.js"), { filename: "math-data.js" }).runInContext(sandbox);
  mathConcepts = sandbox.window.MATH_CONCEPTS ?? [];
  mathCategories = sandbox.window.MATH_CATEGORIES ?? [];
  ok("math-data.js parses and evaluates");
} catch (error) {
  fail(`math-data.js failed to evaluate: ${error.message}`);
}

try {
  new vm.Script(read("data-fr.js"), { filename: "data-fr.js" }).runInContext(sandbox);
  conceptsFr = sandbox.window.AI_CONCEPTS_FR ?? {};
  categoriesFr = sandbox.window.AI_CATEGORIES_FR ?? {};
  ok("data-fr.js parses and evaluates");
} catch (error) {
  fail(`data-fr.js failed to evaluate: ${error.message}`);
}

try {
  new vm.Script(read("math-data-fr.js"), { filename: "math-data-fr.js" }).runInContext(sandbox);
  mathConceptsFr = sandbox.window.MATH_CONCEPTS_FR ?? {};
  mathCategoriesFr = sandbox.window.MATH_CATEGORIES_FR ?? {};
  ok("math-data-fr.js parses and evaluates");
} catch (error) {
  fail(`math-data-fr.js failed to evaluate: ${error.message}`);
}

try {
  // i18n.js reads location at module scope, so give it just enough to run.
  const i18nBox = {
    window: {},
    location: { search: "", hash: "", href: "https://example.test/" },
    document: undefined,
    URLSearchParams,
    Intl
  };
  vm.createContext(i18nBox);
  new vm.Script(read("i18n.js"), { filename: "i18n.js" }).runInContext(i18nBox);
  i18nStrings = i18nBox.window.ATLAS_I18N?.strings ?? {};
  ok("i18n.js parses and evaluates");
} catch (error) {
  fail(`i18n.js failed to evaluate: ${error.message}`);
}

try {
  new vm.Script(read("tools-data.js"), { filename: "tools-data.js" }).runInContext(sandbox);
  tools = sandbox.window.ATLAS_TOOLS ?? [];
  toolCategories = sandbox.window.TOOL_CATEGORIES ?? [];
  ok("tools-data.js parses and evaluates");
} catch (error) {
  fail(`tools-data.js failed to evaluate: ${error.message}`);
}

try {
  new vm.Script(read("tools-data-fr.js"), { filename: "tools-data-fr.js" }).runInContext(sandbox);
  toolsFr = sandbox.window.ATLAS_TOOLS_FR ?? {};
  toolCategoriesFr = sandbox.window.TOOL_CATEGORIES_FR ?? {};
  ok("tools-data-fr.js parses and evaluates");
} catch (error) {
  fail(`tools-data-fr.js failed to evaluate: ${error.message}`);
}

try {
  // quiz.js is a pure module — no DOM, no location — so it can be evaluated
  // and its belt tables checked directly.
  const quizBox = { window: {} };
  vm.createContext(quizBox);
  new vm.Script(read("quiz.js"), { filename: "quiz.js" }).runInContext(quizBox);
  quizApi = quizBox.window.ATLAS_QUIZ ?? null;
  ok("quiz.js parses and evaluates");
} catch (error) {
  fail(`quiz.js failed to evaluate: ${error.message}`);
}

try {
  // app.js is an IIFE that touches the DOM, so only parse it, never run it.
  new vm.Script(read("app.js"), { filename: "app.js" });
  ok("app.js parses");
} catch (error) {
  fail(`app.js has a syntax error: ${error.message}`);
}

section("Concept data model");

if (!Array.isArray(concepts) || concepts.length === 0) {
  fail("window.AI_CONCEPTS is empty or not an array");
} else {
  ok(`${concepts.length} concepts, ${categories.length} categories`);
}

const REQUIRED_FIELDS = ["slug", "acronym", "name", "category", "summary", "why", "how", "example", "tags", "related"];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugs = new Set();
const categoryIds = new Set(categories.map((category) => category.id));
let duplicateSlugs = 0;
let brokenRelated = 0;
let malformedSlugs = 0;
let missingFields = 0;
let selfReferences = 0;

for (const concept of concepts) {
  for (const field of REQUIRED_FIELDS) {
    const value = concept[field];
    const empty = value === undefined || value === null || value === "" ||
      (Array.isArray(value) && value.length === 0);
    if (empty) { missingFields += 1; fail(`"${concept.slug ?? "(no slug)"}" is missing "${field}"`); }
  }

  if (slugs.has(concept.slug)) { duplicateSlugs += 1; fail(`duplicate slug "${concept.slug}"`); }
  slugs.add(concept.slug);

  if (!SLUG_PATTERN.test(String(concept.slug))) {
    malformedSlugs += 1;
    fail(`slug "${concept.slug}" is not URL-safe kebab-case`);
  }

  if (!categoryIds.has(concept.category)) {
    fail(`"${concept.slug}" references unknown category "${concept.category}"`);
  }
}

for (const concept of concepts) {
  for (const related of concept.related ?? []) {
    if (!slugs.has(related)) { brokenRelated += 1; fail(`"${concept.slug}" links to unknown concept "${related}"`); }
    if (related === concept.slug) { selfReferences += 1; fail(`"${concept.slug}" lists itself as related`); }
  }
}

if (!missingFields) ok("every concept has all required fields");
if (!duplicateSlugs) ok("all concept slugs are unique");
if (!malformedSlugs) ok("all slugs are URL-safe kebab-case");
if (!brokenRelated && !selfReferences) ok("every related slug resolves to an existing concept");

for (const category of categories) {
  const count = concepts.filter((concept) => concept.category === category.id).length;
  if (count === 0) warn(`category "${category.id}" has no concepts`);
  if (!/^#[0-9a-f]{6}$/i.test(String(category.color))) fail(`category "${category.id}" has an invalid colour`);
}

const withoutSource = concepts.filter((concept) => !concept.source).length;
if (withoutSource) warn(`${withoutSource} of ${concepts.length} concepts have no primary reference`);
else ok(`all ${concepts.length} concepts carry a primary reference`);

let badSources = 0;
const referenceUrls = new Map();
for (const concept of concepts) {
  const source = concept.source;
  if (!source) continue;
  if (!/^https:\/\//.test(source.url)) { badSources += 1; fail(`"${concept.slug}" has a non-HTTPS reference: ${source.url}`); }
  if (!source.label || source.label.length < 8) { badSources += 1; fail(`"${concept.slug}" has an empty or too-short reference label`); }
  try { new URL(source.url); } catch { badSources += 1; fail(`"${concept.slug}" has a malformed reference URL: ${source.url}`); }
  referenceUrls.set(source.url, (referenceUrls.get(source.url) ?? 0) + 1);
}
if (!badSources) ok("every reference is a well-formed HTTPS URL with a label");
for (const [url, count] of referenceUrls) {
  if (count > 1) warn(`${count} concepts share the reference ${url}`);
}

// Optional `math` blocks power the #learn/<slug> pages.
let mathBlocks = 0;
let badMath = 0;
for (const concept of concepts) {
  if (!concept.math) continue;
  mathBlocks += 1;
  const formulas = concept.math.formulas;
  if (!Array.isArray(formulas) || !formulas.length) { badMath += 1; fail(`"${concept.slug}" has a math block with no formulas`); continue; }
  for (const formula of formulas) {
    if (!formula.expression) { badMath += 1; fail(`"${concept.slug}" has a formula with no expression`); }
  }
}
if (mathBlocks && !badMath) ok(`${mathBlocks} concepts carry a well-formed math block`);

/* ------------------------------------------------------------------ */
/* 2b. Mathematics layer                                                */
/*                                                                      */
/* Mathematics is a cross-cutting layer: the AI → mathematics direction  */
/* is stored on the AI concept, the reverse direction is derived by      */
/* app.js. These checks guarantee both directions resolve, so no page    */
/* can link to something that does not exist and no mathematics page     */
/* can be orphaned.                                                     */
/* ------------------------------------------------------------------ */
section("Mathematics data model");

const MATH_REQUIRED = ["slug", "symbol", "name", "category", "difficulty", "summary", "intuition", "whyInAI", "related", "tags"];
const DIFFICULTIES = new Set(["introductory", "intermediate", "advanced"]);
const INTENSITIES = new Set(["low", "medium", "high"]);
const IMPORTANCES = new Set(["primary", "supporting"]);
// Graph edge verbs. GENERALIZES is defined but deliberately unused: nothing in
// the data justifies it yet, and inventing it would be decoration.
const RELATIONS = new Set([
  "USES", "DEPENDS_ON", "MEASURED_WITH", "OPTIMIZED_BY",
  "APPROXIMATES", "GENERALIZES", "RELATED_TO"
]);

if (!Array.isArray(mathConcepts) || mathConcepts.length === 0) {
  fail("window.MATH_CONCEPTS is empty or not an array");
} else {
  ok(`${mathConcepts.length} mathematics concepts, ${mathCategories.length} branches`);
}

const mathSlugs = new Set();
const mathCategoryIds = new Set(mathCategories.map((category) => category.id));
let mathMissingFields = 0;
let mathBadSlugs = 0;
let mathBadDifficulty = 0;

for (const item of mathConcepts) {
  for (const field of MATH_REQUIRED) {
    const value = item[field];
    const empty = value === undefined || value === null || value === "" ||
      (Array.isArray(value) && value.length === 0);
    if (empty) { mathMissingFields += 1; fail(`math "${item.slug ?? "(no slug)"}" is missing "${field}"`); }
  }

  if (mathSlugs.has(item.slug)) { mathBadSlugs += 1; fail(`duplicate mathematics slug "${item.slug}"`); }
  mathSlugs.add(item.slug);

  if (!SLUG_PATTERN.test(String(item.slug))) {
    mathBadSlugs += 1;
    fail(`mathematics slug "${item.slug}" is not URL-safe kebab-case`);
  }
  if (!mathCategoryIds.has(item.category)) {
    fail(`math "${item.slug}" references unknown branch "${item.category}"`);
  }
  if (!DIFFICULTIES.has(item.difficulty)) {
    mathBadDifficulty += 1;
    fail(`math "${item.slug}" has an invalid difficulty "${item.difficulty}"`);
  }
  if (item.equation && !item.equationNote) {
    warn(`math "${item.slug}" has an equation with no plain-language explanation`);
  }
  if (!RELATIONS.has(item.relation)) {
    fail(`math "${item.slug}" has an invalid or missing relation "${item.relation}"`);
  }
  for (const entry of item.legend ?? []) {
    if (!entry.symbol || !entry.meaning) fail(`math "${item.slug}" has an incomplete legend entry`);
  }
}

if (!mathMissingFields) ok("every mathematics concept has all required fields");
if (!mathBadSlugs) ok("all mathematics slugs are unique and URL-safe");
if (!mathBadDifficulty) ok("all difficulty values are valid");

// Mathematics slugs share a namespace with nothing: #math/<slug> and
// #learn/<slug> are distinct routes, but a collision is still confusing.
const collisions = [...mathSlugs].filter((slug) => slugs.has(slug));
if (collisions.length) collisions.forEach((slug) => warn(`"${slug}" is both an AI concept and a mathematics slug`));
else ok("no slug is used by both layers");

let mathBrokenLinks = 0;
for (const item of mathConcepts) {
  for (const related of item.related ?? []) {
    if (!mathSlugs.has(related)) { mathBrokenLinks += 1; fail(`math "${item.slug}" links to unknown mathematics "${related}"`); }
    if (related === item.slug) { mathBrokenLinks += 1; fail(`math "${item.slug}" lists itself as related`); }
  }
  for (const prerequisite of item.prerequisites ?? []) {
    if (!mathSlugs.has(prerequisite)) { mathBrokenLinks += 1; fail(`math "${item.slug}" requires unknown mathematics "${prerequisite}"`); }
    if (prerequisite === item.slug) { mathBrokenLinks += 1; fail(`math "${item.slug}" lists itself as a prerequisite`); }
  }
}
if (!mathBrokenLinks) ok("every related and prerequisite slug resolves");

for (const category of mathCategories) {
  const count = mathConcepts.filter((item) => item.category === category.id).length;
  if (count === 0) warn(`mathematics branch "${category.id}" has no concepts`);
  if (!/^#[0-9a-f]{6}$/i.test(String(category.color))) fail(`mathematics branch "${category.id}" has an invalid colour`);
}

let mathBadSources = 0;
const mathReferenceUrls = new Map();
for (const item of mathConcepts) {
  if (!item.source) { warn(`math "${item.slug}" has no primary reference`); continue; }
  if (!/^https:\/\//.test(item.source.url)) { mathBadSources += 1; fail(`math "${item.slug}" has a non-HTTPS reference: ${item.source.url}`); }
  if (!item.source.label || item.source.label.length < 8) { mathBadSources += 1; fail(`math "${item.slug}" has an empty or too-short reference label`); }
  try { new URL(item.source.url); } catch { mathBadSources += 1; fail(`math "${item.slug}" has a malformed reference URL`); }
  mathReferenceUrls.set(item.source.url, (mathReferenceUrls.get(item.source.url) ?? 0) + 1);
}
if (!mathBadSources) ok("every mathematics reference is a well-formed HTTPS URL with a label");
for (const [url, count] of mathReferenceUrls) {
  if (count > 1) warn(`${count} mathematics concepts share the reference ${url}`);
}

section("AI ↔ mathematics links");

let badIntensity = 0;
let badFoundations = 0;
let foundationLinks = 0;
const referencedMath = new Set();
const intensityCounts = { low: 0, medium: 0, high: 0 };

for (const concept of concepts) {
  const intensity = concept.mathIntensity;
  const foundations = concept.mathFoundations ?? [];

  if (intensity === undefined) {
    if (foundations.length) { badFoundations += 1; fail(`"${concept.slug}" declares mathFoundations without a mathIntensity`); }
    continue;
  }
  if (!INTENSITIES.has(intensity)) {
    badIntensity += 1;
    fail(`"${concept.slug}" has an invalid mathIntensity "${intensity}"`);
    continue;
  }
  intensityCounts[intensity] += 1;

  // A concept with no foundations must say why, rather than showing nothing.
  if (!foundations.length && !concept.mathNote) {
    fail(`"${concept.slug}" has mathIntensity "${intensity}" but neither mathFoundations nor a mathNote`);
    badFoundations += 1;
  }
  if (intensity === "high" && !foundations.some((link) => link.importance === "primary")) {
    warn(`"${concept.slug}" is marked high intensity but declares no primary mathematics`);
  }

  const seen = new Set();
  for (const link of foundations) {
    foundationLinks += 1;
    if (!mathSlugs.has(link.slug)) {
      badFoundations += 1;
      fail(`"${concept.slug}" links to unknown mathematics "${link.slug}"`);
      continue;
    }
    if (seen.has(link.slug)) { badFoundations += 1; fail(`"${concept.slug}" links to "${link.slug}" twice`); }
    seen.add(link.slug);
    referencedMath.add(link.slug);
    if (!IMPORTANCES.has(link.importance)) {
      badFoundations += 1;
      fail(`"${concept.slug}" → "${link.slug}" has an invalid importance "${link.importance}"`);
    }
    if (link.relation !== undefined && !RELATIONS.has(link.relation)) {
      badFoundations += 1;
      fail(`"${concept.slug}" → "${link.slug}" overrides relation with an invalid "${link.relation}"`);
    }
    if (!link.note) warn(`"${concept.slug}" → "${link.slug}" has no explanation`);
  }
}

if (!badIntensity) ok(`every mathIntensity is one of low, medium, high (${intensityCounts.high} high, ${intensityCounts.medium} medium, ${intensityCounts.low} low)`);
if (!badFoundations) ok(`${foundationLinks} AI → mathematics links all resolve`);

const mapped = concepts.filter((concept) => concept.mathIntensity !== undefined).length;
ok(`${mapped} of ${concepts.length} AI concepts carry a mathematics mapping`);
if (mapped < concepts.length) warn(`${concepts.length - mapped} AI concepts are not mapped yet`);

// An orphan mathematics page is reachable but explains nothing about the atlas.
const orphans = mathConcepts.filter((item) => !referencedMath.has(item.slug));
if (orphans.length) orphans.forEach((item) => fail(`mathematics page "${item.slug}" is an orphan — no AI concept uses it`));
else ok("no orphan mathematics pages — every one is used by at least one AI concept");

/* ------------------------------------------------------------------ */
/* 2b. French layer                                                     */
/*                                                                      */
/* The French files are an OVERLAY keyed by slug, not a parallel copy,   */
/* so the failure mode is not "the translation disagrees with English"   */
/* but "the translation points at something that no longer exists".      */
/* A renamed slug in data.js silently orphans its French text, and the   */
/* page quietly reverts to English with nobody the wiser. That is what   */
/* these checks are for.                                                */
/* ------------------------------------------------------------------ */
section("French layer");

const TRANSLATABLE = ["name", "summary", "why", "how", "example", "mathNote"];
const MATH_TRANSLATABLE = ["name", "summary", "intuition", "equationNote", "worked"];

/* Fields that are not plain strings. Each is checked against the ENGLISH
   record it overlays, because that is where the failure lives: a legend keyed
   by a symbol that no longer exists, or a whyInAI list that no longer matches
   the number of English bullets, both silently revert the section to English
   with nothing on screen to say why. */
const SHAPED = {
  legend: (fr, en) => {
    if (typeof fr !== "object" || Array.isArray(fr)) return "must be an object keyed by symbol";
    const symbols = new Set((en ?? []).map((row) => row.symbol));
    const stray = Object.keys(fr).filter((key) => !symbols.has(key));
    if (stray.length) return `has keys not in the English legend: ${stray.join(", ")}`;
    const missing = [...symbols].filter((sym) => !String(fr[sym] ?? "").trim());
    if (missing.length) return `is missing meanings for: ${missing.join(", ")}`;
    return null;
  },
  whyInAI: (fr, en) => {
    if (!Array.isArray(fr)) return "must be an array";
    if (fr.length !== (en ?? []).length) return `has ${fr.length} items but English has ${(en ?? []).length}`;
    if (fr.some((item) => typeof item !== "string" || !item.trim())) return "contains an empty item";
    return null;
  },
  math: (fr, en) => {
    if (typeof fr !== "object" || Array.isArray(fr)) return "must be an object";
    if (!en) return "translates a math block the English concept does not have";
    if (!String(fr.intro ?? "").trim()) return "has no intro";
    if (!Array.isArray(fr.formulas)) return "has no formulas array";
    if (fr.formulas.length !== (en.formulas ?? []).length) {
      return `has ${fr.formulas.length} formulas but English has ${(en.formulas ?? []).length}`;
    }
    // The equation itself is never translated — W' = W_0 + B A reads the same
    // in every language. A French `expression` would be a second copy of the
    // one thing that must not have two versions.
    const withExpr = fr.formulas.filter((f) => f.expression);
    if (withExpr.length) return "carries an `expression`, which is never translated";
    const empty = fr.formulas.filter((f) => !String(f.label ?? "").trim() || !String(f.note ?? "").trim());
    if (empty.length) return `has ${empty.length} formulas missing a label or note`;
    return null;
  },
  foundations: (fr, en) => {
    if (typeof fr !== "object" || Array.isArray(fr)) return "must be an object keyed by mathematics slug";
    const known = new Set((en ?? []).map((link) => link.slug));
    const stray = Object.keys(fr).filter((key) => !known.has(key));
    if (stray.length) return `points at mathematics the concept does not declare: ${stray.join(", ")}`;
    if (Object.values(fr).some((note) => typeof note !== "string" || !note.trim())) return "contains an empty note";
    return null;
  }
};

/** Which English field a shaped overlay field is checked against. */
const SHAPED_SOURCE = { legend: "legend", whyInAI: "whyInAI", foundations: "mathFoundations", math: "math" };

function checkOverlay(label, overlay, validSlugs, allowed, total, required = allowed, english = new Map()) {
  const keys = Object.keys(overlay);
  const unknown = keys.filter((slug) => !validSlugs.has(slug));
  if (unknown.length) {
    unknown.forEach((slug) =>
      fail(`${label}: "${slug}" does not exist in the English data — renamed or deleted?`));
  } else {
    ok(`${label}: all ${keys.length} entries resolve to a real slug`);
  }

  let badField = 0;
  let empty = 0;
  for (const [slug, patch] of Object.entries(overlay)) {
    if (!patch || typeof patch !== "object") { fail(`${label}: "${slug}" is not an object`); continue; }
    for (const [field, value] of Object.entries(patch)) {
      if (SHAPED[field]) {
        const source = english.get(slug)?.[SHAPED_SOURCE[field]];
        const problem = SHAPED[field](value, source);
        if (problem) { fail(`${label}: "${slug}.${field}" ${problem}`); badField += 1; }
      } else if (!allowed.includes(field)) {
        fail(`${label}: "${slug}" has unknown field "${field}"`); badField += 1;
      } else if (typeof value !== "string" || !value.trim()) {
        fail(`${label}: "${slug}.${field}" is empty`); empty += 1;
      }
    }
  }
  if (!badField && !empty) ok(`${label}: every field is known, well-shaped and non-empty`);

  // Phase-one French covers names and summaries. Falling short of that is not
  // an error — it renders in English and says so — but it is worth reporting,
  // because a card that is half-translated is the most visible kind of gap.
  const missing = [...validSlugs].filter((slug) =>
    required.some((field) => !String(overlay[slug]?.[field] ?? "").trim()));
  if (missing.length) warn(`${label}: ${missing.length} of ${total} entries lack ${required.join(" or ")}`);
  else ok(`${label}: all ${total} entries carry ${required.join(" + ")}`);
}

const conceptBySlugEn = new Map(concepts.map((item) => [item.slug, item]));
const mathBySlugEn = new Map(mathConcepts.map((item) => [item.slug, item]));

checkOverlay("data-fr.js concepts", conceptsFr, slugs, TRANSLATABLE,
  concepts.length, ["name", "summary"], conceptBySlugEn);
checkOverlay("math-data-fr.js concepts", mathConceptsFr, mathSlugs, MATH_TRANSLATABLE,
  mathConcepts.length, ["name", "summary"], mathBySlugEn);
checkOverlay("data-fr.js domains", categoriesFr, categoryIds, ["name", "short"], categories.length);
checkOverlay("math-data-fr.js branches", mathCategoriesFr, mathCategoryIds, ["name", "short"], mathCategories.length);

// A key present in one language and absent in the other renders as a blank
// label or, worse, silently falls back mid-sentence. Both tables must match.
const enKeys = Object.keys(i18nStrings.en ?? {});
const frKeys = Object.keys(i18nStrings.fr ?? {});
if (!enKeys.length || !frKeys.length) {
  fail("i18n.js exposed no string tables");
} else {
  const missingFr = enKeys.filter((key) => !(key in i18nStrings.fr));
  const missingEn = frKeys.filter((key) => !(key in i18nStrings.en));
  missingFr.forEach((key) => fail(`i18n.js: "${key}" is missing from the French table`));
  missingEn.forEach((key) => fail(`i18n.js: "${key}" is missing from the English table`));
  if (!missingFr.length && !missingEn.length) ok(`i18n.js: both string tables carry the same ${enKeys.length} keys`);

  // A {placeholder} that exists in one language and not the other prints the
  // literal braces at the reader, and a plural form present on only one side
  // silently drops the count.
  let mismatched = 0;
  for (const key of enKeys) {
    const en = String(i18nStrings.en[key] ?? "");
    const fr = String(i18nStrings.fr[key] ?? "");
    const vars = (value) => [...new Set(value.match(/\{(\w+)\}/g) ?? [])].sort().join(",");
    if (vars(en) !== vars(fr)) { fail(`i18n.js: "${key}" uses different placeholders in each language`); mismatched += 1; }
    if (en.includes("|") !== fr.includes("|")) { fail(`i18n.js: "${key}" has a plural form in only one language`); mismatched += 1; }
  }
  if (!mismatched) ok("i18n.js: placeholders and plural forms agree across both languages");

  // Untranslated French is the failure this layer exists to prevent.
  const SAME_BY_DESIGN = new Set([
    "htmlLang",           // the language code itself
    "langEnglish",        // each language is named in its own language
    "langFrench",
    "englishChip",        // "EN" is the same token everywhere
    "noscriptLink",       // a filename
    "footerName",         // "AI Concept Atlas" is the product name, not prose
    "conceptTitle",       // ditto — only the interpolated concept name changes
    "statConcepts",       // "concepts" and "branches" are spelled the same
    "statBranches",
    "bandCount",          // "{n} concept|{n} concepts" happens to be identical
    "quizQuestions"       // same word in both languages, same plural break
  ]);
  // Japanese terminology is never translated — 礼 is 礼 and "Sore made" is
  // "Sore made" in every language, exactly as the atlas leaves ∇ and LoRA
  // alone. Any string carrying kana or kanji is therefore expected to match,
  // which is a rule rather than a growing list of exceptions.
  const JAPANESE = /[\u3040-\u30ff\u4e00-\u9faf]/;

  const identical = enKeys.filter((key) =>
    !SAME_BY_DESIGN.has(key) &&
    !JAPANESE.test(String(i18nStrings.en[key])) &&
    String(i18nStrings.en[key]).length > 12 && i18nStrings.en[key] === i18nStrings.fr[key]);
  if (identical.length) identical.forEach((key) => warn(`i18n.js: "${key}" is identical in both languages`));
  else ok("i18n.js: no French string is a verbatim copy of its English original");
}

/* The hero image's alt text names a concept count in prose. Nothing else
   checks it, and it is exactly the kind of number that drifts silently the
   first time a concept is added — the same failure the map's own footer
   counts are guarded against. */
const altCount = (i18nStrings.en?.heroImageAlt ?? "").match(/(\d+)\s+AI terms/);
if (!altCount) {
  warn("i18n.js: heroImageAlt no longer states a concept count — remove this check or restore it");
} else if (Number(altCount[1]) !== concepts.length) {
  fail(`i18n.js: heroImageAlt says ${altCount[1]} AI terms but data.js has ${concepts.length}`);
} else {
  ok(`heroImageAlt's "${altCount[1]} AI terms" matches the data`);
}

/* ------------------------------------------------------------------ */
/* 2d. The Workshop                                                     */
/*                                                                      */
/* This is the one section of the atlas whose content is expected to    */
/* rot: sites die, rebrand and quietly change purpose. The checks are   */
/* therefore stricter than anywhere else — a dead link here costs more  */
/* than a missing one, because it makes a reader doubt the 125 paper    */
/* references too.                                                      */
/* ------------------------------------------------------------------ */
section("The Workshop");

const TOOL_REQUIRED = ["id", "name", "url", "category", "what", "answers", "related", "checked"];
const toolIds = new Set();
const toolCategoryIds = new Set(toolCategories.map((c) => c.id));
const conceptAndMathSlugs = new Set([...slugs, ...mathSlugs]);
let toolProblems = 0;

for (const tool of tools) {
  const missing = TOOL_REQUIRED.filter((f) => tool[f] === undefined || tool[f] === "");
  if (missing.length) { fail(`workshop "${tool.id ?? "?"}" is missing: ${missing.join(", ")}`); toolProblems += 1; continue; }
  if (toolIds.has(tool.id)) { fail(`workshop id "${tool.id}" is used twice`); toolProblems += 1; }
  toolIds.add(tool.id);
  if (!toolCategoryIds.has(tool.category)) { fail(`workshop "${tool.id}" has unknown section "${tool.category}"`); toolProblems += 1; }
  if (!/^https:\/\//.test(tool.url)) { fail(`workshop "${tool.id}" is not HTTPS`); toolProblems += 1; }
  // A date the reader is shown has to be real, and cannot be in the future.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tool.checked)) {
    fail(`workshop "${tool.id}" has a malformed checked date: ${tool.checked}`); toolProblems += 1;
  } else if (new Date(`${tool.checked}T00:00:00Z`) > new Date()) {
    fail(`workshop "${tool.id}" claims to have been checked in the future`); toolProblems += 1;
  }
  // The link back into the atlas is what makes this more than a bookmark list.
  const stray = (tool.related ?? []).filter((slug) => !conceptAndMathSlugs.has(slug));
  if (stray.length) { fail(`workshop "${tool.id}" points at concepts that do not exist: ${stray.join(", ")}`); toolProblems += 1; }
  if (!(tool.related ?? []).length) { fail(`workshop "${tool.id}" links to no atlas concept`); toolProblems += 1; }
}
if (!toolProblems) ok(`${tools.length} workshop entries: HTTPS, dated, and every atlas link resolves`);

const emptySections = toolCategories.filter((c) => !tools.some((t) => t.category === c.id));
if (emptySections.length) emptySections.forEach((c) => fail(`workshop section "${c.id}" has no entries`));
else ok(`all ${toolCategories.length} workshop sections have entries`);

const strayFr = Object.keys(toolsFr).filter((id) => !toolIds.has(id));
if (strayFr.length) strayFr.forEach((id) => fail(`tools-data-fr.js: "${id}" is not a workshop entry`));
else ok("tools-data-fr.js: every key matches a real entry");
const untranslated = [...toolIds].filter((id) => !toolsFr[id]?.what || !toolsFr[id]?.answers);
if (untranslated.length) warn(`${untranslated.length} workshop entries lack French`);
else ok(`all ${toolIds.size} workshop entries are translated`);

/* ------------------------------------------------------------------ */
/* 2c. The Dojo                                                         */
/*                                                                      */
/* The quiz generates its questions from the atlas, so most of what     */
/* could go wrong is caught by the concept checks above. What is left   */
/* is the grading table itself, which no other check touches: an        */
/* unreachable belt or an out-of-order threshold would silently make a  */
/* grade impossible to earn and nobody would ever notice.               */
/* ------------------------------------------------------------------ */
section("The Dojo");

if (!quizApi) {
  fail("quiz.js exposed no ATLAS_QUIZ");
} else {
  const belts = quizApi.BELTS ?? [];
  const dans = quizApi.DANS ?? [];

  const ascending = (list, label) => {
    let last = -1;
    let bad = 0;
    for (const item of list) {
      if (item.min <= last) { fail(`${label}: "${item.id ?? item.name}" threshold ${item.min} is not above the previous`); bad += 1; }
      last = item.min;
    }
    if (!bad) ok(`${label}: ${list.length} thresholds strictly ascending`);
  };

  ascending(belts, "belt ladder");

  /* The dan grades are graded on mistakes, which count DOWN as the grade goes
     up — Judan allows none, Shodan allows nine. Checking that they descend by
     exactly one is what guarantees every grade is reachable, which is the
     property a percentage scale silently lost at this run length. */
  let lastDropped = null;
  let danBad = 0;
  for (const dan of dans) {
    if (lastDropped !== null && dan.dropped !== lastDropped - 1) {
      fail(`dan grades: ${dan.name} allows ${dan.dropped} dropped, expected ${lastDropped - 1}`);
      danBad += 1;
    }
    lastDropped = dan.dropped;
  }
  if (dans[dans.length - 1]?.dropped !== 0) fail("dan grades: the highest grade must allow no mistakes");
  else if (!danBad) ok(`dan grades: ${dans.length} steps descending one mistake at a time to a flawless Judan`);

  /* Every grade must be reachable on a run of DAN_LENGTH. This is the check
     that would have caught Hachidan being unearnable under the old scale. */
  const unearnable = dans.filter((dan) =>
    dan.dropped > quizApi.DAN_LENGTH || quizApi.danFor(dan.dropped)?.rank !== dan.rank);
  if (unearnable.length) unearnable.forEach((d) => fail(`dan grade ${d.name} cannot be earned on a ${quizApi.DAN_LENGTH}-question run`));
  else ok(`every dan grade is reachable on the ${quizApi.DAN_LENGTH}-question challenge`);

  if (belts[0]?.min !== 0) fail("belt ladder: the lowest belt must start at 0, or a bad score awards nothing");
  else ok("belt ladder: starts at 0, so every run awards a belt");

  // Every belt must be reachable on the run length it is gated to, or the
  // ladder is advertising a rank that cannot be earned.
  const unreachable = belts.filter((belt) => {
    const total = belt.gated ? quizApi.FULL_LENGTH : Math.max(...quizApi.LENGTHS.filter((n) => n < quizApi.FULL_LENGTH));
    return quizApi.beltFor(100, total).id !== belts[belts.length - 1].id && belt.gated
      ? false
      : quizApi.beltFor(belt.min, belt.gated ? quizApi.FULL_LENGTH : total).id !== belt.id;
  });
  if (unreachable.length) unreachable.forEach((b) => fail(`belt "${b.id}" cannot be earned at its own threshold`));
  else ok("every belt is reachable at its own threshold");

  // The gate is the whole point of the hundred-question run.
  const gated = belts.filter((b) => b.gated);
  const leaked = gated.filter((b) => quizApi.beltFor(100, 10).id === b.id);
  if (leaked.length) leaked.forEach((b) => fail(`gated belt "${b.id}" is awardable on a short run`));
  else ok(`${gated.length} gated belts require the ${quizApi.FULL_LENGTH}-question run`);

  if (dans.length !== 10) fail(`dan grades: expected 10, found ${dans.length}`);
  else ok("ten dan grades, Shodan through Judan");

  const styles = new Set(dans.map((d) => d.style));
  if (!styles.has("black") || !styles.has("kohaku") || !styles.has("red")) {
    fail("dan grades: expected black, red-and-white and red belt styles");
  } else ok("dan belt styles cover black, red-and-white and red");

  if (quizApi.danFor(dans[0].dropped + 1) !== null) fail("dan grades: dropping more than the lowest grade allows must award nothing");
  else ok("dropping more than the limit awards no dan");
  if (quizApi.danFor(0)?.rank !== 10) fail("dan grades: a flawless run must award the tenth dan");
  else ok("a flawless dan run awards Judan");
}

/* ------------------------------------------------------------------ */
/* 3. Generated concept map                                             */
/* ------------------------------------------------------------------ */
section("Concept map (assets/ai-concept-map.svg)");

const mapSvg = read("assets/ai-concept-map.svg");
const svgEscape = (value) => String(value).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// The map deliberately shows a sample, not an inventory: it renders at 1120px,
// where 75 labels would land at 8px and be unreadable. So it is NOT checked for
// every concept. Staleness is caught by the footer counts below — add a concept
// without regenerating and the footer disagrees with the data.
//
// The alt text is the contract instead: it names every domain and every branch,
// it is what a screen reader announces, and it has to be right regardless.
const altMatch = mapSvg.match(/aria-label="([^"]+)"/);
// The attribute is XML-escaped in the file, so "&" arrives as "&amp;".
const alt = altMatch
  ? altMatch[1].replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).toLowerCase()
  : "";
if (!alt) fail("the map has no aria-label — it is unusable to a screen reader");

let missingDomains = 0;
for (const category of categories) {
  if (!alt.includes(category.name.toLowerCase())) {
    missingDomains += 1;
    fail(`domain "${category.name}" is missing from the map's description — run: node tools/build-map.mjs`);
  }
}
if (alt && !missingDomains) ok(`the map describes all ${categories.length} domains`);

// Landmarks are chosen by degree, so they change as relationships are added.
// Checking that each domain contributes at least one keeps the picture honest
// without pinning it to a particular set.
let emptyDomains = 0;
for (const category of categories) {
  const items = concepts.filter((c) => c.category === category.id);
  const shown = items.filter((c) => mapSvg.includes(`>${svgEscape(c.acronym)}</tspan>`));
  if (items.length && !shown.length) {
    emptyDomains += 1;
    fail(`domain "${category.name}" contributes no concept to the map — run: node tools/build-map.mjs`);
  }
}
if (!emptyDomains) ok(`every domain is represented by at least one named concept`);

// The centre of the map carries the mathematics ring; if a branch is added to
// math-data.js and the map is not regenerated, the picture quietly under-reports.
let missingBranches = 0;
for (const category of mathCategories) {
  if (!mapSvg.includes(`>${svgEscape(category.short)}</text>`)) {
    missingBranches += 1;
    fail(`mathematics branch "${category.short}" is missing from the map — run: node tools/build-map.mjs`);
  }
}
if (!missingBranches) ok(`all ${mathCategories.length} mathematics branches present in the map centre`);
if (!mapSvg.includes(`${mathConcepts.length} MATHEMATICAL FOUNDATIONS`)) {
  fail("the map's mathematics count is stale — run: node tools/build-map.mjs");
} else {
  ok("map footer matches the mathematics count");
}
if (!mapSvg.includes(`${concepts.length} CONCEPTS`)) {
  fail(`the map's footer count is stale — run: node tools/build-map.mjs`);
} else {
  ok("map footer matches the concept count");
}

/* ------------------------------------------------------------------ */
/* 4. HTML structure                                                    */
/* ------------------------------------------------------------------ */
section("HTML structure");

const html = read("index.html");

const HTML_CHECKS = [
  [/<!doctype html>/i, "doctype declared"],
  [/<html lang="[a-z-]+"/i, "html element declares a language"],
  [/<meta charset="utf-8"/i, "charset declared"],
  [/<meta name="viewport"/i, "viewport declared"],
  [/<meta name="description"/i, "meta description present"],
  [/<link rel="canonical"/i, "canonical URL present"],
  [/property="og:title"/, "Open Graph title present"],
  [/property="og:url"/, "Open Graph URL present"],
  [/property="og:image"\s+content="https:\/\//, "Open Graph image uses an absolute URL"],
  [/<main[\s>]/, "main landmark present"],
  [/<noscript>/, "noscript fallback present"],
  [/<script src="data\.js(\?[^"]*)?"/, "data.js is loaded"],
  [/<script src="math-data\.js(\?[^"]*)?"/, "math-data.js is loaded"],
  [/<script src="app\.js(\?[^"]*)?"/, "app.js is loaded"],
  [/href="#mathematics"/, "the mathematics layer is linked from the page"]
];

for (const [pattern, label] of HTML_CHECKS) {
  if (pattern.test(html)) ok(label);
  else fail(`missing: ${label}`);
}

// Every element that opens a new browsing context must be tab-nabbing safe.
const externalAnchors = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
const unsafeAnchors = externalAnchors.filter((tag) => !/rel="[^"]*noopener[^"]*"/.test(tag) || !/rel="[^"]*noreferrer[^"]*"/.test(tag));
if (externalAnchors.length === 0) warn("no target=\"_blank\" anchors found in index.html");
else if (unsafeAnchors.length) unsafeAnchors.forEach((tag) => fail(`target="_blank" without rel="noopener noreferrer": ${tag}`));
else ok(`${externalAnchors.length} external anchors use rel="noopener noreferrer"`);

if (/https:\/\/github\.com\/"/.test(html)) fail("index.html still contains the placeholder GitHub URL");
else ok("no placeholder GitHub URL");

// Cache busting. GitHub Pages serves with max-age=600, so a returning visitor
// can pair a fresh index.html with a stale app.js and see a half-rendered page.
// A shared version token prevents that — but only if every file carries the
// same one, so a partial bump must fail rather than ship a subtler mismatch.
const VERSIONED = ["styles.css", "data.js", "math-data.js", "data-fr.js", "math-data-fr.js",
  "tools-data.js", "tools-data-fr.js", "i18n.js", "quiz.js", "app.js", "assets/ai-concept-map.svg"];
const versions = new Map();
for (const file of VERSIONED) {
  const match = html.match(new RegExp(`(?:href|src)="${file.replace(".", "\\.")}\\?v=([^"]+)"`));
  if (!match) fail(`${file} carries no ?v= cache-busting token in index.html`);
  else versions.set(file, match[1]);
}
const distinct = new Set(versions.values());
if (versions.size === VERSIONED.length && distinct.size === 1) {
  ok(`all ${VERSIONED.length} local assets share the cache token ?v=${[...distinct][0]}`);
} else if (distinct.size > 1) {
  fail(`cache tokens disagree: ${[...versions].map(([f, v]) => `${f}=${v}`).join(", ")}`);
}

// Referenced local assets must exist on disk (href, src and <source srcset>).
const assetRefs = [...html.matchAll(/(?:href|src|srcset)="((?!https?:|#|mailto:|data:)[^"]+)"/g)].map((match) => match[1]);
const missingAssets = assetRefs.filter((ref) => !existsSync(join(ROOT, ref.split("?")[0])));
if (missingAssets.length) missingAssets.forEach((ref) => fail(`index.html references a missing file: ${ref}`));
else ok(`${assetRefs.length} local references resolve to real files`);

// Every id app.js looks up — via getElementById or the $() helper — must
// exist in the markup, otherwise the script throws on load.
const appSource = read("app.js");
const referencedIds = [
  ...[...appSource.matchAll(/getElementById\("([^"]+)"\)/g)].map((match) => match[1]),
  ...[...appSource.matchAll(/(?<![\w.$])\$\("([^"]+)"\)/g)].map((match) => match[1])
];
const uniqueIds = new Set(referencedIds);
if (uniqueIds.size < 10) fail(`only ${uniqueIds.size} element ids detected in app.js — the id check is not matching, fix the pattern`);

// Ids the Dojo writes into #quizStage itself. They are looked up immediately
// after the innerHTML that creates them, so they always exist by the time $()
// runs — but they are not in the static markup and never should be, because
// the quiz screen is rebuilt from scratch on every state change. Listed by
// name rather than by loosening the check: an id genuinely forgotten from
// index.html must still fail the build.
const RUNTIME_IDS = new Set(["quizTitle", "quizPrompt"]);
for (const id of RUNTIME_IDS) {
  if (!new RegExp(`id="${id}"`).test(appSource)) {
    fail(`"${id}" is exempted as runtime-created but app.js never creates it`);
  }
}

const missingIds = [...uniqueIds]
  .filter((id) => !RUNTIME_IDS.has(id))
  .filter((id) => !new RegExp(`id="${id}"`).test(html));
if (missingIds.length) missingIds.forEach((id) => fail(`app.js expects #${id}, which is absent from index.html`));
else ok(`${uniqueIds.size} element ids required by app.js exist`);

/* ------------------------------------------------------------------ */
/* 4. CSS sanity                                                        */
/* ------------------------------------------------------------------ */
section("CSS sanity");

const css = read("styles.css");
const braceBalance = (css.match(/{/g) ?? []).length - (css.match(/}/g) ?? []).length;
if (braceBalance === 0) ok("braces balanced");
else fail(`unbalanced braces in styles.css (${braceBalance > 0 ? "+" : ""}${braceBalance})`);

if (!/\/\*(?:(?!\*\/)[\s\S])*$/.test(css)) ok("no unterminated comment");
else fail("styles.css contains an unterminated comment");

// Class names appear three ways: as plain attributes, at the head of an app.js
// template literal such as class="filter-button${active ? " active" : ""}", and
// as bare string constants that are interpolated in (NODE_CLASS, EDGE_CLASS).
// The last form is invisible to an attribute-only scan, so quoted single-token
// strings that look like class names count as references too.
const combinedSource = `${html}\n${appSource}`;
const usedClasses = new Set([
  ...[...combinedSource.matchAll(/class="([^"$]+)/g)]
    .flatMap((match) => match[1].split(/\s+/)),
  ...[...combinedSource.matchAll(/"([a-z][a-z0-9]*(?:-[a-z0-9]+)+)"/g)]
    .map((match) => match[1])
].filter(Boolean));
const CRITICAL_CLASSES = [
  "concept-card", "search-result", "filter-button", "concept-dialog",
  "domain-band", "view-tab", "graph-node", "graph-edge", "learn-view", "reference-card", "formula",
  "math-card", "math-chip", "intensity-badge", "difficulty-chip", "symbol-legend", "foundation-list",
  "graph-math", "edge-label", "layer-toggle", "graph-focus", "legend-diamond"
];
for (const critical of CRITICAL_CLASSES) {
  if (!css.includes(`.${critical}`)) fail(`.${critical} has no styling rule`);
  else if (!usedClasses.has(critical)) warn(`.${critical} is styled but never used`);
}
if (/:focus-visible/.test(css)) ok("focus-visible styling present");
else fail("no :focus-visible rule — keyboard focus would be invisible");

if (/prefers-reduced-motion/.test(css)) ok("reduced-motion support present");
else warn("no prefers-reduced-motion media query");

/* ------------------------------------------------------------------ */
/* 5. Workflow YAML                                                     */
/* ------------------------------------------------------------------ */
section("GitHub Actions workflow");

const workflow = read(".github/workflows/pages.yml");

if (/\t/.test(workflow)) fail("workflow YAML contains tab characters (invalid YAML indentation)");
else ok("no tab characters in workflow YAML");

const WORKFLOW_CHECKS = [
  [/^on:/m, "workflow has a trigger block"],
  [/branches:\s*\["main"\]/, "runs on pushes to main"],
  [/workflow_dispatch:/, "supports manual dispatch"],
  [/contents:\s*read/, "contents: read"],
  [/pages:\s*write/, "pages: write"],
  [/id-token:\s*write/, "id-token: write"],
  [/name:\s*github-pages/, "github-pages environment"],
  [/url:\s*\$\{\{\s*steps\.deployment\.outputs\.page_url\s*\}\}/, "publishes the deployment URL"],
  [/^concurrency:/m, "concurrency protection configured"],
  [/actions\/checkout@v\d+/, "uses actions/checkout"],
  [/actions\/configure-pages@v\d+/, "uses actions/configure-pages"],
  [/actions\/upload-pages-artifact@v\d+/, "uses actions/upload-pages-artifact"],
  [/actions\/deploy-pages@v\d+/, "uses actions/deploy-pages"],
  [/path:\s*_site/, "uploads only the staged _site directory"],
  [/cp .*\bmath-data\.js\b.* _site\//, "math-data.js is staged for publication"],
  [/cp .*\bi18n\.js\b.* _site\//, "i18n.js is staged for publication"],
  [/cp .*\bdata-fr\.js\b.* _site\//, "data-fr.js is staged for publication"],
  [/cp .*\bmath-data-fr\.js\b.* _site\//, "math-data-fr.js is staged for publication"],
  [/cp .*\bquiz\.js\b.* _site\//, "quiz.js is staged for publication"],
  [/cp .*\btools-data\.js\b.* _site\//, "tools-data.js is staged for publication"],
  [/cp .*\btools-data-fr\.js\b.* _site\//, "tools-data-fr.js is staged for publication"]
];

for (const [pattern, label] of WORKFLOW_CHECKS) {
  if (pattern.test(workflow)) ok(label);
  else fail(`workflow: missing ${label}`);
}

if (/path:\s*\.\s*$/m.test(workflow)) fail("workflow uploads the whole repository (path: .)");

/* ------------------------------------------------------------------ */
/* 6. Secret scan                                                       */
/* ------------------------------------------------------------------ */
/* A stray control byte is nearly invisible: editors render it as nothing,
   git shows the file as binary but still commits it, and JavaScript happily
   accepts it inside a template string. One reached quiz.js and survived every
   test, because a NUL works perfectly well as a separator. Cheap to check. */
section("Source hygiene");

const CONTROL = /[\u0000-\u0008\u000e-\u001f]/;
let dirty = 0;
for (const file of REQUIRED_FILES) {
  if (!existsSync(join(ROOT, file))) continue;
  if (/\.(ico|png|svg)$/.test(file)) continue;
  const body = read(file);
  const hit = body.match(CONTROL);
  if (hit) {
    const at = body.indexOf(hit[0]);
    const line = body.slice(0, at).split("\n").length;
    fail(`${file} contains a control byte U+${hit[0].charCodeAt(0).toString(16).padStart(4, "0")} at line ${line}`);
    dirty += 1;
  }
}
if (!dirty) ok("no stray control bytes in any source file");

section("Secret scan");

const SECRET_PATTERNS = [
  [/\bgh[pousr]_[A-Za-z0-9]{16,}/, "GitHub token"],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/, "GitHub fine-grained PAT"],
  [/\bsk-[A-Za-z0-9]{20,}/, "OpenAI-style API key"],
  [/\bsk-ant-[A-Za-z0-9-]{20,}/, "Anthropic API key"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key id"],
  [/-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/, "private key block"],
  [/\b(?:password|passwd|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"'\s]{8,}["']/i, "hardcoded credential"]
];

const scanTargets = [];
const walk = (dir, relative = "") => {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if ([".git", "node_modules", "_site", "assets"].includes(entry.name)) continue;
    const rel = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) walk(join(dir, entry.name), rel);
    else if (/\.(js|mjs|css|html|md|yml|yaml|json|svg|txt)$/i.test(entry.name)) scanTargets.push(rel);
  }
};
walk(".");

let secretHits = 0;
for (const file of scanTargets) {
  const contents = read(file);
  for (const [pattern, label] of SECRET_PATTERNS) {
    if (pattern.test(contents)) { secretHits += 1; fail(`possible ${label} in ${file}`); }
  }
}
if (!secretHits) ok(`${scanTargets.length} text files scanned, no secrets detected`);

if (existsSync(join(ROOT, ".claude/settings.local.json"))) {
  const ignore = existsSync(join(ROOT, ".gitignore")) ? read(".gitignore") : "";
  if (/^\.claude\/?$/m.test(ignore) || /settings\.local\.json/.test(ignore)) ok(".claude local settings are git-ignored");
  else fail(".claude/settings.local.json exists but is not git-ignored");
}

/* ------------------------------------------------------------------ */
/* Optional: reachability of every primary reference (--links)          */
/* ------------------------------------------------------------------ */
if (CHECK_LINKS) {
  section("Reference reachability (--links)");
  const targets = [...concepts, ...mathConcepts].filter((item) => item.source?.url);
  let reachable = 0;
  const problems = [];

  for (const concept of targets) {
    const url = concept.source.url;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      let response = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
      // Some publishers reject HEAD outright; retry once with a ranged GET.
      if (response.status === 405 || response.status === 501) {
        response = await fetch(url, { method: "GET", redirect: "follow", headers: { Range: "bytes=0-0" }, signal: controller.signal });
      }
      clearTimeout(timer);
      if (response.ok || response.status === 206) reachable += 1;
      else problems.push(`${concept.slug}: HTTP ${response.status} — ${url}`);
    } catch (error) {
      problems.push(`${concept.slug}: ${error.name === "AbortError" ? "timed out" : error.message} — ${url}`);
    }
  }

  ok(`${reachable}/${targets.length} references responded successfully`);
  // Treated as warnings: bot protection and rate limits produce false alarms.
  problems.forEach((problem) => warn(problem));
  if (problems.length) console.warn("  → check these by hand; publishers often block automated requests");
}

/* ------------------------------------------------------------------ */
/* Summary                                                              */
/* ------------------------------------------------------------------ */
/* Desktop launcher                                                     */
/* ------------------------------------------------------------------ */
section("Desktop launcher");

/**
 * tools/create-shortcut.ps1 must stay pure ASCII.
 *
 * Windows PowerShell 5.1 - which is what `powershell.exe` still is, and what
 * anyone will actually type - reads a .ps1 as Windows-1252 unless the file
 * carries a UTF-8 BOM. A UTF-8 em dash therefore arrives as three garbage
 * bytes mid-token, and the parser dies pointing at something several
 * characters away from the real problem. The sister GEN7 atlas shipped exactly
 * that bug.
 *
 * Pure ASCII is byte-identical under both encodings, which sidesteps the
 * question. This check exists because the failure is invisible on anything
 * that is not a Windows shell - including wherever this validator runs.
 */
const launcherBytes = readFileSync(join(ROOT, "tools/create-shortcut.ps1"));
const launcherNonAscii = [...launcherBytes].filter((b) => b > 127);
if (launcherNonAscii.length) {
  const at = [...launcherBytes].findIndex((b) => b > 127);
  const near = launcherBytes.subarray(Math.max(0, at - 40), at + 20).toString("utf8").replace(/\s+/g, " ");
  fail(`tools/create-shortcut.ps1 has ${launcherNonAscii.length} non-ASCII byte(s) - Windows PowerShell 5.1 reads it as Windows-1252 and will not parse it. Near: "...${near}..."`);
} else {
  ok(`tools/create-shortcut.ps1 is pure ASCII (${launcherBytes.length} bytes), so powershell.exe parses it`);
}

// The shortcut points at the published site by default, so that URL has to be
// the one the site actually claims as canonical.
const launcherText = launcherBytes.toString("utf8");
const canonical = (read("index.html").match(/<link rel="canonical" href="([^"]+)"/) ?? [])[1];
if (canonical) {
  if (launcherText.includes(canonical.replace(/\/$/, ""))) {
    ok("the launcher points at the canonical published URL");
  } else {
    fail(`the launcher's live URL does not match the canonical URL in index.html (${canonical})`);
  }
}

/* ------------------------------------------------------------------ */
console.log(`\n${"-".repeat(58)}`);
if (failures) {
  console.error(`FAILED — ${failures} error(s), ${warnings} warning(s).`);
  process.exit(1);
}
console.log(`PASSED — 0 errors, ${warnings} warning(s).`);
console.log(`${concepts.length} concepts across ${categories.length} domains validated.`);
console.log(`${mathConcepts.length} mathematics concepts across ${mathCategories.length} branches validated.`);
