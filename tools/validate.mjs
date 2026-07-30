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
  "README.md",
  "LICENSE",
  "CLAUDE.md",
  ".gitignore",
  ".github/workflows/pages.yml",
  "assets/favicon.svg",
  "assets/ai-concept-map.svg",
  "assets/ai-concept-map.png",
  "tools/build-map.mjs"
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

try {
  new vm.Script(read("data.js"), { filename: "data.js" }).runInContext(sandbox);
  concepts = sandbox.window.AI_CONCEPTS ?? [];
  categories = sandbox.window.AI_CATEGORIES ?? [];
  ok("data.js parses and evaluates");
} catch (error) {
  fail(`data.js failed to evaluate: ${error.message}`);
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
/* 3. Generated concept map                                             */
/* ------------------------------------------------------------------ */
section("Concept map (assets/ai-concept-map.svg)");

const mapSvg = read("assets/ai-concept-map.svg");
const svgEscape = (value) => String(value).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const missingFromMap = concepts.filter((concept) =>
  !mapSvg.includes(`>${svgEscape(concept.acronym)}</tspan>`));
if (missingFromMap.length) {
  missingFromMap.slice(0, 8).forEach((concept) =>
    fail(`"${concept.acronym}" is missing from the map — run: node tools/build-map.mjs`));
  if (missingFromMap.length > 8) fail(`…and ${missingFromMap.length - 8} more missing from the map`);
} else {
  ok(`all ${concepts.length} concepts appear in the map`);
}

let missingDomains = 0;
for (const category of categories) {
  if (!mapSvg.includes(svgEscape(category.name.toUpperCase()))) {
    missingDomains += 1;
    fail(`domain "${category.name}" is missing from the map — run: node tools/build-map.mjs`);
  }
}
if (!missingDomains) ok(`all ${categories.length} domain panels present`);
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
  [/<script src="data\.js"/, "data.js is loaded"],
  [/<script src="app\.js"/, "app.js is loaded"]
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
const missingIds = [...uniqueIds].filter((id) => !new RegExp(`id="${id}"`).test(html));
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

// Class names appear both as plain attributes and inside app.js template
// literals such as class="filter-button${active ? " active" : ""}".
const usedClasses = new Set(
  [...`${html}\n${appSource}`.matchAll(/class="([^"$]+)/g)]
    .flatMap((match) => match[1].split(/\s+/))
    .filter(Boolean)
);
const CRITICAL_CLASSES = [
  "concept-card", "search-result", "filter-button", "concept-dialog",
  "domain-band", "view-tab", "graph-node", "graph-edge", "learn-view", "reference-card", "formula"
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
  [/path:\s*_site/, "uploads only the staged _site directory"]
];

for (const [pattern, label] of WORKFLOW_CHECKS) {
  if (pattern.test(workflow)) ok(label);
  else fail(`workflow: missing ${label}`);
}

if (/path:\s*\.\s*$/m.test(workflow)) fail("workflow uploads the whole repository (path: .)");

/* ------------------------------------------------------------------ */
/* 6. Secret scan                                                       */
/* ------------------------------------------------------------------ */
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
  const targets = concepts.filter((concept) => concept.source?.url);
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
console.log(`\n${"-".repeat(58)}`);
if (failures) {
  console.error(`FAILED — ${failures} error(s), ${warnings} warning(s).`);
  process.exit(1);
}
console.log(`PASSED — 0 errors, ${warnings} warning(s).`);
console.log(`${concepts.length} concepts across ${categories.length} domains validated.`);
