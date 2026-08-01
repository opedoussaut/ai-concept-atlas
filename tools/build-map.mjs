#!/usr/bin/env node
/**
 * Generates assets/ai-concept-map.svg from data.js.
 *
 *   node tools/build-map.mjs
 *
 * The map is drawn from the live concept data, so it can never drift out of
 * sync with the atlas: add a concept and re-run this. Output is a few KB of
 * vector, stays sharp at any zoom, uses the site's own palette, and — like
 * everything else here — makes no external request.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {} };
vm.createContext(sandbox);
new vm.Script(readFileSync(join(ROOT, "data.js"), "utf8")).runInContext(sandbox);
new vm.Script(readFileSync(join(ROOT, "math-data.js"), "utf8")).runInContext(sandbox);
const concepts = sandbox.window.AI_CONCEPTS;
const categories = sandbox.window.AI_CATEGORIES;
const mathConcepts = sandbox.window.MATH_CONCEPTS;
const mathCategories = sandbox.window.MATH_CATEGORIES;

/* ------------------------------------------------------------------ */
/* Weighting                                                            */
/*                                                                      */
/* Every concept rendered at the same weight gives the eye nowhere to    */
/* land. Degree — how many other concepts declare a relationship — is    */
/* already in the data, so the hubs can carry more visual weight than    */
/* the leaves without anyone deciding by hand which ones matter.         */
/* ------------------------------------------------------------------ */

const degree = new Map(concepts.map((c) => [c.slug, 0]));
const seenPair = new Set();
for (const concept of concepts) {
  for (const other of concept.related ?? []) {
    if (!degree.has(other) || other === concept.slug) continue;
    const key = [concept.slug, other].sort().join("|");
    if (seenPair.has(key)) continue;
    seenPair.add(key);
    degree.set(concept.slug, degree.get(concept.slug) + 1);
    degree.set(other, degree.get(other) + 1);
  }
}
// Degrees run 3..12 across the current data, which splits cleanly three ways.
const tierOf = (slug) => {
  const d = degree.get(slug) ?? 0;
  return d >= 6 ? "hub" : d >= 4 ? "mid" : "leaf";
};

/** How heavily the AI layer leans on each branch of mathematics. */
const mathBranchLoad = new Map(mathCategories.map((cat) => [cat.id, 0]));
for (const concept of concepts) {
  for (const link of concept.mathFoundations ?? []) {
    const target = mathConcepts.find((m) => m.slug === link.slug);
    if (target) mathBranchLoad.set(target.category, mathBranchLoad.get(target.category) + 1);
  }
}

/* ------------------------------------------------------------------ */
/* Canvas and layout                                                    */
/* ------------------------------------------------------------------ */

const W = 1700;
const H = 1150;

// The core used to be a 132px disc reading "AI — Artificial Intelligence": the
// most prominent object on the canvas carrying the least information. It is now
// a smaller hub encircled by the seven branches of mathematics, so the centre
// states the atlas's actual argument — eight domains of AI resting on one small
// shared set of mathematics — instead of restating the title.
const CORE = { x: 850, y: 575, r: 76 };
const MATH_RING = { rx: 236, ry: 204 };

const ROW = 23;          // line height inside a panel
const HEAD = 58;         // panel header height
const PAD = 20;          // panel inner padding
const FONT = 12.5;

// Panels are placed in three bands: a left column, a right column, and two
// wide panels above and below the core.
const SLOTS = [
  { id: "foundations",   x: 40,   y: 62,  w: 432, columns: 1 },
  // The two wide slots sit closest to the centre, so their height is the first
  // thing to squeeze the connector corridor when a domain gains concepts.
  { id: "architectures", x: 556,  y: 26,  w: 588, columns: 2 },
  { id: "training",      x: 1228, y: 62,  w: 432, columns: 1 },
  { id: "retrieval",     x: 40,   y: 396, w: 432, columns: 1 },
  { id: "agents",        x: 1228, y: 400, w: 432, columns: 1 },
  { id: "inference",     x: 40,   y: 672, w: 432, columns: 1 },
  { id: "multimodal",    x: 556,  y: 906, w: 588, columns: 2 },
  { id: "safety",        x: 1228, y: 740, w: 432, columns: 1 }
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Rough advance width for the Inter/system stack, used only to shrink a label
// that would otherwise run past its column.
const widthOf = (text, size) => {
  let units = 0;
  for (const ch of String(text)) {
    if ("iljtfrI.,:;'".includes(ch)) units += 0.34;
    else if ("mwMW".includes(ch)) units += 0.92;
    else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) units += 0.68;
    else if (ch === " ") units += 0.28;
    else units += 0.55;
  }
  // 1.1 safety factor: the estimate runs low against real Inter metrics, and
  // a label that overflows its column is worse than one that is slightly small.
  return units * size * 1.1;
};

const panels = SLOTS.map((slot) => {
  const category = categories.find((c) => c.id === slot.id);
  const items = concepts.filter((c) => c.category === slot.id);
  const rows = Math.ceil(items.length / slot.columns);
  return { ...slot, category, items, rows, h: HEAD + rows * ROW + PAD };
});

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

const parts = [];

parts.push(`<defs>
  <radialGradient id="bg" cx="50%" cy="42%" r="78%">
    <stop offset="0%" stop-color="#0b1d33"/>
    <stop offset="55%" stop-color="#071224"/>
    <stop offset="100%" stop-color="#03070e"/>
  </radialGradient>
  <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#5de7ff" stop-opacity="0.42"/>
    <stop offset="55%" stop-color="#2f8ad0" stop-opacity="0.14"/>
    <stop offset="100%" stop-color="#5de7ff" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="coreEdge" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#7ef0ff"/>
    <stop offset="100%" stop-color="#8f7bff"/>
  </linearGradient>
  <pattern id="grid" width="58" height="58" patternUnits="userSpaceOnUse">
    <path d="M58 0H0v58" fill="none" stroke="#71b1e9" stroke-opacity="0.075" stroke-width="1"/>
  </pattern>
  <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="16"/>
  </filter>
  <filter id="tight" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="4"/>
  </filter>
  <radialGradient id="mathGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffc978" stop-opacity="0.20"/>
    <stop offset="70%" stop-color="#ffc978" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#ffc978" stop-opacity="0"/>
  </radialGradient>
</defs>`);

parts.push(`<rect width="${W}" height="${H}" fill="url(#bg)"/>`);
parts.push(`<rect width="${W}" height="${H}" fill="url(#grid)"/>`);

// Connector from the core to each panel, leaving the core at the panel's angle
// and entering the panel on its nearest vertical edge.
panels.forEach((panel, index) => {
  const isLeft = panel.x + panel.w / 2 < CORE.x;
  const isWide = panel.columns === 2;
  const midY = panel.y + panel.h / 2;

  let ex, ey;
  if (isWide) { ex = panel.x + panel.w / 2; ey = panel.y < CORE.y ? panel.y + panel.h : panel.y; }
  else { ex = isLeft ? panel.x + panel.w : panel.x; ey = midY; }

  // Connectors now leave from outside the mathematics ring, so each domain
  // visibly grows out of the foundations rather than out of a bare label.
  // The two wide panels sit directly above and below the centre, so their
  // connectors run down the one corridor the ring labels also want. Starting
  // them further out keeps that corridor clear.
  const angle = Math.atan2(ey - CORE.y, ex - CORE.x);
  const sx = CORE.x + Math.cos(angle) * (MATH_RING.rx + (isWide ? 46 : 30));
  const sy = CORE.y + Math.sin(angle) * (MATH_RING.ry + (isWide ? 46 : 26));
  const mx = isWide ? ex : (sx + ex) / 2;
  const my = isWide ? (sy + ey) / 2 : ey;
  const d = `M${sx.toFixed(1)} ${sy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;

  parts.push(`<path d="${d}" fill="none" stroke="${panel.category.color}" stroke-opacity="0.34" stroke-width="1.4"/>`);
  // A second, dashed copy drifts along the same path: motion without changing
  // the drawing. Disabled wholesale under prefers-reduced-motion.
  // The dash pattern is a presentation attribute, not only CSS: a renderer that
  // ignores the stylesheet then draws a dotted trace rather than a solid line
  // doubling the connector beneath it. CSS only animates the offset.
  parts.push(`<path class="spark" style="animation-delay:${(index * -1.4).toFixed(1)}s" d="${d}" fill="none" stroke="${panel.category.color}" stroke-opacity="0.85" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 128"/>`);
  parts.push(`<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3.4" fill="${panel.category.color}" fill-opacity="0.85"/>`);
  parts.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="2.6" fill="${panel.category.color}"/>`);
});

// Panels
panels.forEach((panel, index) => {
  const { x, y, w, h, category, items, columns, rows } = panel;
  const colWidth = (w - PAD * 2 - (columns - 1) * 18) / columns;

  parts.push(`<g>`);
  parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="#08172a" fill-opacity="0.82" stroke="${category.color}" stroke-opacity="0.38" stroke-width="1.3"/>`);
  // Accent bar along the top edge of the panel.
  parts.push(`<rect x="${x + 22}" y="${y - 1}" width="${w - 44}" height="2.4" rx="1.2" fill="${category.color}" fill-opacity="0.85"/>`);
  parts.push(`<rect x="${x + 22}" y="${y - 1}" width="${w - 44}" height="2.4" rx="1.2" fill="${category.color}" filter="url(#tight)" opacity="0.6"/>`);

  // Header: number, name, count
  parts.push(`<circle cx="${x + PAD + 13}" cy="${y + 31}" r="13" fill="${category.color}" fill-opacity="0.14" stroke="${category.color}" stroke-opacity="0.55"/>`);
  parts.push(`<text x="${x + PAD + 13}" y="${y + 35.5}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${category.color}">${index + 1}</text>`);
  parts.push(`<text x="${x + PAD + 36}" y="${y + 36}" font-size="15" font-weight="700" letter-spacing="0.9" fill="#f4f8ff">${esc(category.name.toUpperCase())}</text>`);
  parts.push(`<text x="${x + w - PAD}" y="${y + 36}" text-anchor="end" font-size="11.5" fill="#7f92aa">${items.length}</text>`);
  parts.push(`<line x1="${x + PAD}" y1="${y + 48}" x2="${x + w - PAD}" y2="${y + 48}" stroke="#9dd2ff" stroke-opacity="0.14"/>`);

  items.forEach((concept, i) => {
    const col = Math.floor(i / rows);
    const row = i % rows;
    const cx = x + PAD + col * (colWidth + 18);
    const cy = y + HEAD + row * ROW + 11;

    const tier = tierOf(concept.slug);
    const bullet = tier === "hub" ? 3.6 : tier === "mid" ? 2.7 : 2.1;
    const bulletOpacity = tier === "hub" ? 1 : tier === "mid" ? 0.85 : 0.5;
    const tokenFill = tier === "hub" ? "#ffffff" : tier === "mid" ? "#eaf2ff" : "#b6c6d9";
    const nameFill = tier === "leaf" ? "#7f93aa" : "#9fb2c8";

    if (tier === "hub") {
      parts.push(`<circle cx="${cx + 3}" cy="${cy - 4}" r="6" fill="${category.color}" fill-opacity="0.28" filter="url(#tight)"/>`);
    }
    parts.push(`<circle cx="${cx + 3}" cy="${cy - 4}" r="${bullet}" fill="${category.color}" fill-opacity="${bulletOpacity}"/>`);

    const acronym = concept.acronym;

    // Only spell the name out when the token is a real abbreviation. If the
    // name merely restates the token with a generic qualifier — "Transformer
    // Architecture", "AI Alignment", "Model Pruning" — the expansion is noise.
    const letters = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const a = letters(acronym);
    const n = letters(concept.name);
    let showName = !n.includes(a) && a.length < n.length * 0.7;

    // Shrink rather than overflow the column; drop the expansion if even the
    // smallest size will not fit.
    const room = colWidth - 26;   // bullet offset plus breathing room
    const MIN = 8.5;
    let size = FONT;
    const fits = (text, at) => widthOf(text, at) <= room;
    if (showName) {
      while (!fits(`${acronym} — ${concept.name}`, size) && size > MIN) size -= 0.25;
      if (!fits(`${acronym} — ${concept.name}`, size)) { showName = false; size = FONT; }
    }
    while (!fits(acronym, size) && size > MIN) size -= 0.25;

    parts.push(`<text x="${cx + 14}" y="${cy}" font-size="${size.toFixed(2)}" fill="${nameFill}">`
      + `<tspan font-weight="${tier === "hub" ? 800 : 700}" fill="${tokenFill}">${esc(acronym)}</tspan>`
      + (showName ? `<tspan> — ${esc(concept.name)}</tspan>` : "")
      + `</text>`);
  });

  parts.push(`</g>`);
});

/* ------------------------------------------------------------------ */
/* Centre: the AI hub encircled by the mathematics it rests on          */
/* ------------------------------------------------------------------ */

// Ambient glow behind the whole assembly.
parts.push(`<ellipse cx="${CORE.x}" cy="${CORE.y}" rx="${MATH_RING.rx * 1.5}" ry="${MATH_RING.ry * 1.5}" fill="url(#coreGlow)"/>`);
parts.push(`<ellipse cx="${CORE.x}" cy="${CORE.y}" rx="${MATH_RING.rx * 1.15}" ry="${MATH_RING.ry * 1.15}" fill="url(#mathGlow)"/>`);

// The orbit the mathematics sits on.
parts.push(`<ellipse class="orbit" cx="${CORE.x}" cy="${CORE.y}" rx="${MATH_RING.rx}" ry="${MATH_RING.ry}" fill="none" stroke="#ffc978" stroke-opacity="0.22" stroke-width="1" stroke-dasharray="2 8"/>`);

const mathNodes = mathCategories.map((cat, i) => {
  // Half-step offset: with seven branches, starting at the top would put a node
  // at 12 o'clock and another near 6 o'clock — exactly where the two wide
  // panels' connectors run. Rotating by half a step frees both corridors.
  const angle = (i / mathCategories.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / mathCategories.length / 2;
  const load = mathBranchLoad.get(cat.id) ?? 0;
  return {
    cat, load,
    count: mathConcepts.filter((m) => m.category === cat.id).length,
    x: CORE.x + Math.cos(angle) * MATH_RING.rx,
    y: CORE.y + Math.sin(angle) * MATH_RING.ry
  };
});

const maxLoad = Math.max(...mathNodes.map((n) => n.load), 1);

// Spokes from the hub out to each branch.
for (const node of mathNodes) {
  const angle = Math.atan2(node.y - CORE.y, node.x - CORE.x);
  parts.push(`<line x1="${(CORE.x + Math.cos(angle) * (CORE.r + 8)).toFixed(1)}" y1="${(CORE.y + Math.sin(angle) * (CORE.r + 8)).toFixed(1)}" x2="${node.x.toFixed(1)}" y2="${node.y.toFixed(1)}" stroke="#ffc978" stroke-opacity="${(0.14 + (node.load / maxLoad) * 0.30).toFixed(2)}" stroke-width="${(0.9 + (node.load / maxLoad) * 1.5).toFixed(1)}"/>`);
}

// Branch nodes. Diamonds, matching the shape used for mathematics in the
// interactive graph; size carries how heavily the AI layer leans on each.
mathNodes.forEach((node, i) => {
  const r = 7 + (node.load / maxLoad) * 7;
  parts.push(`<g class="branch" style="animation-delay:${(i * -1.1).toFixed(1)}s">`);
  parts.push(`<path d="M${node.x.toFixed(1)} ${(node.y - r - 5).toFixed(1)} L ${(node.x + r + 5).toFixed(1)} ${node.y.toFixed(1)} L ${node.x.toFixed(1)} ${(node.y + r + 5).toFixed(1)} L ${(node.x - r - 5).toFixed(1)} ${node.y.toFixed(1)} Z" fill="${node.cat.color}" fill-opacity="0.16"/>`);
  parts.push(`<path d="M${node.x.toFixed(1)} ${(node.y - r).toFixed(1)} L ${(node.x + r).toFixed(1)} ${node.y.toFixed(1)} L ${node.x.toFixed(1)} ${(node.y + r).toFixed(1)} L ${(node.x - r).toFixed(1)} ${node.y.toFixed(1)} Z" fill="${node.cat.color}" stroke="#061426" stroke-width="1.4"/>`);
  parts.push(`</g>`);

  // Label sits outside the node, pushed away from the centre. Above the node the
  // two lines stack upward so the count never lands on the diamond's top vertex,
  // while still reading name-then-count top to bottom.
  const below = node.y >= CORE.y;
  const nameY = below ? node.y + r + 20 : node.y - r - 30;
  const countY = nameY + 15;
  parts.push(`<text x="${node.x.toFixed(1)}" y="${nameY.toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f0dcb8">${esc(node.cat.short)}</text>`);
  parts.push(`<text x="${node.x.toFixed(1)}" y="${countY.toFixed(1)}" text-anchor="middle" font-size="10.5" fill="#a08a63">${node.load} links</text>`);
  node.labelBox = { x1: node.x - 62, x2: node.x + 62, y1: nameY - 11, y2: countY + 3 };
});

// Hub.
for (const [r, op] of [[CORE.r + 26, 0.14], [CORE.r + 13, 0.3]]) {
  parts.push(`<circle class="pulse" cx="${CORE.x}" cy="${CORE.y}" r="${r}" fill="none" stroke="#5de7ff" stroke-opacity="${op}" stroke-width="1"/>`);
}
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r}" fill="#061426"/>`);
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r}" fill="none" stroke="url(#coreEdge)" stroke-width="2.2"/>`);
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r}" fill="none" stroke="#5de7ff" stroke-width="6" opacity="0.32" filter="url(#soft)"/>`);
// The hub states the whole argument in three lines. Naming the ring here rather
// than captioning it underneath keeps the crowded band below the orbit — where
// two branch labels and the lower connector already compete — completely clear,
// and the gold on the last line ties the hub to the ring around it.
parts.push(`<text x="${CORE.x}" y="${CORE.y - 10}" text-anchor="middle" font-size="42" font-weight="800" letter-spacing="-1.6" fill="#ffffff">AI</text>`);
parts.push(`<text x="${CORE.x}" y="${CORE.y + 15}" text-anchor="middle" font-size="10.5" font-weight="700" letter-spacing="1.3" fill="#7f9ab5">${concepts.length} CONCEPTS</text>`);
parts.push(`<text x="${CORE.x}" y="${CORE.y + 33}" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="0.7" fill="#ffc978" opacity="0.92">ON ${mathConcepts.length} FOUNDATIONS</text>`);

// Footer credit
parts.push(`<text x="${W / 2}" y="${H - 22}" text-anchor="middle" font-size="12.5" letter-spacing="2.4" fill="#5c7a99" opacity="0.9">AI CONCEPT ATLAS &#183; ${concepts.length} CONCEPTS &#183; ${categories.length} DOMAINS &#183; ${mathConcepts.length} MATHEMATICAL FOUNDATIONS</text>`);

// Declarative CSS animation runs even when the SVG is referenced through an
// <img>, unlike script. Long durations and low amplitude: the picture should
// feel alive at the edge of vision, not demand attention. The reduced-motion
// query is honoured by the browser here exactly as it is in styles.css.
const style = `
text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.spark{stroke-dasharray:3 128;animation:flow 9s linear infinite}
@keyframes flow{from{stroke-dashoffset:131}to{stroke-dashoffset:0}}
.pulse{animation:breathe 7s ease-in-out infinite alternate}
@keyframes breathe{from{stroke-opacity:.10}to{stroke-opacity:.42}}
.branch{animation:glimmer 8s ease-in-out infinite alternate}
@keyframes glimmer{from{opacity:.72}to{opacity:1}}
.orbit{animation:orbitfade 11s ease-in-out infinite alternate}
@keyframes orbitfade{from{stroke-opacity:.12}to{stroke-opacity:.34}}
@media (prefers-reduced-motion:reduce){.spark,.pulse,.branch,.orbit{animation:none}.spark{opacity:0}}
`.trim();

const alt = `Concept map of ${concepts.length} artificial intelligence terms grouped into ${categories.length} domains, `
  + `arranged around a central hub encircled by the ${mathCategories.length} branches of mathematics they rest on: `
  + `${mathCategories.map((c) => c.short.toLowerCase()).join(", ")}.`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(alt)}">
<style>${style}</style>
${parts.join("\n")}
</svg>
`;

writeFileSync(join(ROOT, "assets/ai-concept-map.svg"), svg, "utf8");
const kb = (Buffer.byteLength(svg) / 1024).toFixed(1);
console.log(`assets/ai-concept-map.svg written — ${kb} KB, ${concepts.length} concepts across ${categories.length} domains`);
for (const panel of panels) {
  console.log(`  ${panel.category.name.padEnd(32)} ${String(panel.items.length).padStart(2)} items  ${panel.columns} col  h=${panel.h}`);
}
