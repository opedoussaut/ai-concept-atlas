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
const concepts = sandbox.window.AI_CONCEPTS;
const categories = sandbox.window.AI_CATEGORIES;

/* ------------------------------------------------------------------ */
/* Canvas and layout                                                    */
/* ------------------------------------------------------------------ */

const W = 1700;
const H = 1150;
const CORE = { x: 850, y: 575, r: 132 };

const ROW = 23;          // line height inside a panel
const HEAD = 58;         // panel header height
const PAD = 20;          // panel inner padding
const FONT = 12.5;

// Panels are placed in three bands: a left column, a right column, and two
// wide panels above and below the core.
const SLOTS = [
  { id: "foundations",   x: 40,   y: 62,  w: 432, columns: 1 },
  { id: "architectures", x: 556,  y: 40,  w: 588, columns: 2 },
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
</defs>`);

parts.push(`<rect width="${W}" height="${H}" fill="url(#bg)"/>`);
parts.push(`<rect width="${W}" height="${H}" fill="url(#grid)"/>`);

// Connector from the core to each panel, leaving the core at the panel's angle
// and entering the panel on its nearest vertical edge.
for (const panel of panels) {
  const isLeft = panel.x + panel.w / 2 < CORE.x;
  const isWide = panel.columns === 2;
  const midY = panel.y + panel.h / 2;

  let ex, ey;
  if (isWide) { ex = panel.x + panel.w / 2; ey = panel.y < CORE.y ? panel.y + panel.h : panel.y; }
  else { ex = isLeft ? panel.x + panel.w : panel.x; ey = midY; }

  const angle = Math.atan2(ey - CORE.y, ex - CORE.x);
  const sx = CORE.x + Math.cos(angle) * (CORE.r + 16);
  const sy = CORE.y + Math.sin(angle) * (CORE.r + 16);
  const mx = isWide ? ex : (sx + ex) / 2;
  const my = isWide ? (sy + ey) / 2 : ey;

  parts.push(`<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${panel.category.color}" stroke-opacity="0.34" stroke-width="1.4"/>`);
  parts.push(`<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3.4" fill="${panel.category.color}" fill-opacity="0.85"/>`);
  parts.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="2.6" fill="${panel.category.color}"/>`);
}

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

    parts.push(`<circle cx="${cx + 3}" cy="${cy - 4}" r="2.6" fill="${category.color}" fill-opacity="0.9"/>`);

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

    parts.push(`<text x="${cx + 14}" y="${cy}" font-size="${size.toFixed(2)}" fill="#9fb2c8">`
      + `<tspan font-weight="700" fill="#eaf2ff">${esc(acronym)}</tspan>`
      + (showName ? `<tspan> — ${esc(concept.name)}</tspan>` : "")
      + `</text>`);
  });

  parts.push(`</g>`);
});

// Core
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r * 2.5}" fill="url(#coreGlow)"/>`);
for (const [r, op, dash] of [[CORE.r + 46, 0.16, "3 9"], [CORE.r + 26, 0.26, "none"], [CORE.r + 10, 0.4, "none"]]) {
  parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${r}" fill="none" stroke="#5de7ff" stroke-opacity="${op}" stroke-width="1"${dash === "none" ? "" : ` stroke-dasharray="${dash}"`}/>`);
}
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r}" fill="#061426"/>`);
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r}" fill="none" stroke="url(#coreEdge)" stroke-width="2.2"/>`);
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r}" fill="none" stroke="#5de7ff" stroke-width="6" opacity="0.32" filter="url(#soft)"/>`);
parts.push(`<text x="${CORE.x}" y="${CORE.y - 12}" text-anchor="middle" font-size="62" font-weight="800" letter-spacing="-2" fill="#ffffff">AI</text>`);
parts.push(`<line x1="${CORE.x - 34}" y1="${CORE.y + 6}" x2="${CORE.x + 34}" y2="${CORE.y + 6}" stroke="#5de7ff" stroke-opacity="0.5"/>`);
parts.push(`<text x="${CORE.x}" y="${CORE.y + 32}" text-anchor="middle" font-size="16" font-weight="600" fill="#9fb3c9">Artificial</text>`);
parts.push(`<text x="${CORE.x}" y="${CORE.y + 54}" text-anchor="middle" font-size="16" font-weight="600" fill="#9fb3c9">Intelligence</text>`);

// Footer credit
parts.push(`<text x="${W / 2}" y="${H - 22}" text-anchor="middle" font-size="12.5" letter-spacing="2.4" fill="#5c7a99" opacity="0.9">AI CONCEPT ATLAS &#183; ${concepts.length} CONCEPTS &#183; ${categories.length} DOMAINS</text>`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Concept map of ${concepts.length} artificial intelligence terms grouped into ${categories.length} domains around a central AI core.">
<style>text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}</style>
${parts.join("\n")}
</svg>
`;

writeFileSync(join(ROOT, "assets/ai-concept-map.svg"), svg, "utf8");
const kb = (Buffer.byteLength(svg) / 1024).toFixed(1);
console.log(`assets/ai-concept-map.svg written — ${kb} KB, ${concepts.length} concepts across ${categories.length} domains`);
for (const panel of panels) {
  console.log(`  ${panel.category.name.padEnd(32)} ${String(panel.items.length).padStart(2)} items  ${panel.columns} col  h=${panel.h}`);
}
