#!/usr/bin/env node
/**
 * Generates assets/ai-concept-map.svg from data.js and math-data.js.
 *
 *   node tools/build-map.mjs
 *
 * The map is drawn from the live concept data, so it can never drift out of
 * sync with the atlas. Output is a few KB of vector, stays sharp at any zoom,
 * uses the site's own palette, and makes no external request.
 *
 * ---------------------------------------------------------------------------
 * Why this is not a list of every concept
 *
 * The hero renders at most 1120px wide (see .hero-visual in styles.css). An
 * earlier version of this map used a 1700px canvas, so its 12.5px labels came
 * out at 8.2px on screen — and smaller on a laptop. Seventy-five labels at 8px
 * is texture, not information: unreadable, and worse, it *looks* like it is
 * meant to be read.
 *
 * So the canvas is now sized to roughly what it is displayed at, and the map
 * shows structure rather than inventory: eight domains with their counts, the
 * mathematics they rest on, and the three best-connected concepts in each
 * domain as landmarks. Every label lands at 11px or larger on screen. The full
 * list already lives in the atlas grid below the hero, which is searchable,
 * filterable and clickable — everything a picture cannot be.
 *
 * Prominence is earned by selection, never by dimming: showing fewer things
 * brightly beats showing everything faintly.
 * ---------------------------------------------------------------------------
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
/* Weighting — which concepts earn a place on the map                   */
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

// Sized to its display width, so 1 unit here is very nearly 1 CSS pixel.
const W = 1200;
const H = 820;
// r=68 is the smallest radius that keeps "ON <n> FOUNDATIONS" inside the disc
// at its baseline; anything tighter and the gold line crosses the ring edge.
const CORE = { x: 600, y: 400, r: 68 };
const MATH_RING = { rx: 186, ry: 150 };

const CARD_W = 300;
const CARD_H = 152;
const LANDMARKS = 3;      // concepts named per domain

// Four cards down each side; the centre column belongs to the hub and its ring.
const SLOTS = [
  { id: "foundations",   x: 24,  y: 30 },
  { id: "retrieval",     x: 24,  y: 214 },
  { id: "inference",     x: 24,  y: 398 },
  { id: "safety",        x: 24,  y: 582 },
  { id: "architectures", x: 876, y: 30 },
  { id: "training",      x: 876, y: 214 },
  { id: "agents",        x: 876, y: 398 },
  { id: "multimodal",    x: 876, y: 582 }
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Rough advance width for the Inter/system stack, used only to shrink a label
// that would otherwise run past its card.
const widthOf = (text, size) => {
  let units = 0;
  for (const ch of String(text)) {
    if ("iljtfrI.,:;'".includes(ch)) units += 0.34;
    else if ("mwMW".includes(ch)) units += 0.92;
    else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) units += 0.68;
    else if (ch === " ") units += 0.28;
    else units += 0.55;
  }
  // 1.1 safety factor: the estimate runs low against real Inter metrics, and a
  // label that overflows its card is worse than one that is slightly small.
  return units * size * 1.1;
};

const cards = SLOTS.map((slot, index) => {
  const category = categories.find((c) => c.id === slot.id);
  const items = concepts.filter((c) => c.category === slot.id);
  const landmarks = [...items]
    .sort((a, b) => (degree.get(b.slug) ?? 0) - (degree.get(a.slug) ?? 0))
    .slice(0, LANDMARKS);
  return { ...slot, index, category, total: items.length, landmarks };
});

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

const parts = [];

parts.push(`<defs>
  <radialGradient id="bg" cx="50%" cy="46%" r="76%">
    <stop offset="0%" stop-color="#0b1d33"/>
    <stop offset="55%" stop-color="#071224"/>
    <stop offset="100%" stop-color="#03070e"/>
  </radialGradient>
  <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#5de7ff" stop-opacity="0.40"/>
    <stop offset="55%" stop-color="#2f8ad0" stop-opacity="0.13"/>
    <stop offset="100%" stop-color="#5de7ff" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="mathGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffc978" stop-opacity="0.18"/>
    <stop offset="70%" stop-color="#ffc978" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#ffc978" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="coreEdge" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#7ef0ff"/>
    <stop offset="100%" stop-color="#8f7bff"/>
  </linearGradient>
  <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
    <path d="M52 0H0v52" fill="none" stroke="#71b1e9" stroke-opacity="0.07" stroke-width="1"/>
  </pattern>
  <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="12"/>
  </filter>
  <filter id="tight" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="3"/>
  </filter>
</defs>`);

parts.push(`<rect width="${W}" height="${H}" fill="url(#bg)"/>`);
parts.push(`<rect width="${W}" height="${H}" fill="url(#grid)"/>`);

/* Connectors: ring → card, leaving the ring at the card's own angle. */
cards.forEach((card) => {
  const isLeft = card.x < CORE.x;
  const ex = isLeft ? card.x + CARD_W : card.x;
  const ey = card.y + CARD_H / 2;

  const angle = Math.atan2(ey - CORE.y, ex - CORE.x);
  const sx = CORE.x + Math.cos(angle) * (MATH_RING.rx + 26);
  const sy = CORE.y + Math.sin(angle) * (MATH_RING.ry + 22);
  const d = `M${sx.toFixed(1)} ${sy.toFixed(1)} Q ${((sx + ex) / 2).toFixed(1)} ${ey.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;

  parts.push(`<path d="${d}" fill="none" stroke="${card.category.color}" stroke-opacity="0.34" stroke-width="1.3"/>`);
  // A dashed copy drifts along the same path: motion without redrawing the line.
  // The dash pattern is a presentation attribute so a renderer that ignores CSS
  // shows a dotted trace rather than a second solid stroke.
  parts.push(`<path class="spark" style="animation-delay:${(card.index * -1.3).toFixed(1)}s" d="${d}" fill="none" stroke="${card.category.color}" stroke-opacity="0.9" stroke-width="1.7" stroke-linecap="round" stroke-dasharray="3 118"/>`);
  parts.push(`<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3.2" fill="${card.category.color}" fill-opacity="0.85"/>`);
  parts.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="2.4" fill="${card.category.color}"/>`);
});

/* Domain cards. */
cards.forEach((card) => {
  const { x, y, category, total, landmarks, index } = card;

  parts.push(`<rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="17" fill="#08172a" fill-opacity="0.86" stroke="${category.color}" stroke-opacity="0.36" stroke-width="1.2"/>`);
  parts.push(`<rect x="${x + 20}" y="${y - 1}" width="${CARD_W - 40}" height="2.2" rx="1.1" fill="${category.color}" fill-opacity="0.9"/>`);
  parts.push(`<rect x="${x + 20}" y="${y - 1}" width="${CARD_W - 40}" height="2.2" rx="1.1" fill="${category.color}" filter="url(#tight)" opacity="0.6"/>`);

  parts.push(`<circle cx="${x + 30}" cy="${y + 31}" r="12" fill="${category.color}" fill-opacity="0.15" stroke="${category.color}" stroke-opacity="0.55"/>`);
  parts.push(`<text x="${x + 30}" y="${y + 35.5}" text-anchor="middle" font-size="12" font-weight="700" fill="${category.color}">${index + 1}</text>`);

  // The header owns the full width — the domain total moved down to the "+N
  // more" line, where it does not compete with the name. Names still too long
  // at the smallest acceptable size wrap onto a second line at their "&" rather
  // than being shrunk into illegibility or silently overflowing the card.
  const room = CARD_W - 68;
  const upper = category.name.toUpperCase();
  // The floor is deliberately high: below 12 the header reads noticeably
  // smaller than its neighbours, so wrapping is the better failure mode than
  // shrinking. Only "Evaluation, safety & reliability" reaches it today.
  let nameSize = 13;
  while (widthOf(upper, nameSize) > room && nameSize > 12) nameSize -= 0.25;

  let lines = [upper];
  if (widthOf(upper, nameSize) > room) {
    const cut = upper.lastIndexOf(" & ");
    if (cut > 0) lines = [upper.slice(0, cut), upper.slice(cut + 1).trim()];
  }
  // Space for two lines is always reserved, so every card's divider aligns.
  const firstY = lines.length === 2 ? y + 29 : y + 36;
  lines.forEach((line, i) => {
    parts.push(`<text x="${x + 50}" y="${(firstY + i * 15).toFixed(1)}" font-size="${nameSize.toFixed(2)}" font-weight="700" letter-spacing="0.7" fill="#f4f8ff">${esc(line)}</text>`);
  });
  parts.push(`<line x1="${x + 18}" y1="${y + 58}" x2="${x + CARD_W - 18}" y2="${y + 58}" stroke="#9dd2ff" stroke-opacity="0.15"/>`);

  // Landmarks: the best-connected concepts in this domain. All rendered at full
  // contrast — the hierarchy is in which ones appear at all.
  landmarks.forEach((concept, i) => {
    const cy = y + 80 + i * 21;
    parts.push(`<circle cx="${x + 22}" cy="${cy - 4}" r="2.8" fill="${category.color}" fill-opacity="0.95"/>`);

    // Only spell the name out when the token is a genuine abbreviation.
    const letters = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const a = letters(concept.acronym);
    const n = letters(concept.name);
    let showName = !n.includes(a) && a.length < n.length * 0.7;

    const space = CARD_W - 48;
    let size = 12;
    const fits = (t, at) => widthOf(t, at) <= space;
    if (showName) {
      while (!fits(`${concept.acronym} — ${concept.name}`, size) && size > 10) size -= 0.25;
      if (!fits(`${concept.acronym} — ${concept.name}`, size)) { showName = false; size = 12; }
    }
    while (!fits(concept.acronym, size) && size > 10) size -= 0.25;

    parts.push(`<text x="${x + 32}" y="${cy}" font-size="${size.toFixed(2)}" fill="#9fb2c8">`
      + `<tspan font-weight="700" fill="#eaf2ff">${esc(concept.acronym)}</tspan>`
      + (showName ? `<tspan> — ${esc(concept.name)}</tspan>` : "")
      + `</text>`);
  });

  // Signal that the card is a sample, not the whole domain — and carry the
  // domain total here, out of the header's way.
  const rest = total - landmarks.length;
  const footY = y + 80 + LANDMARKS * 21;
  if (rest > 0) {
    parts.push(`<text x="${x + 32}" y="${footY}" font-size="10.5" fill="#64778e">+ ${rest} more in the atlas</text>`);
  }
  parts.push(`<text x="${x + CARD_W - 18}" y="${footY}" text-anchor="end" font-size="10.5" font-weight="700" fill="${category.color}" fill-opacity="0.85">${total}</text>`);
});

/* ------------------------------------------------------------------ */
/* Centre: the AI hub encircled by the mathematics it rests on          */
/* ------------------------------------------------------------------ */

parts.push(`<ellipse cx="${CORE.x}" cy="${CORE.y}" rx="${(MATH_RING.rx * 1.5).toFixed(0)}" ry="${(MATH_RING.ry * 1.5).toFixed(0)}" fill="url(#coreGlow)"/>`);
parts.push(`<ellipse cx="${CORE.x}" cy="${CORE.y}" rx="${(MATH_RING.rx * 1.15).toFixed(0)}" ry="${(MATH_RING.ry * 1.15).toFixed(0)}" fill="url(#mathGlow)"/>`);
parts.push(`<ellipse class="orbit" cx="${CORE.x}" cy="${CORE.y}" rx="${MATH_RING.rx}" ry="${MATH_RING.ry}" fill="none" stroke="#ffc978" stroke-opacity="0.22" stroke-width="1" stroke-dasharray="2 7"/>`);

const mathNodes = mathCategories.map((cat, i) => {
  // Half-step offset so no branch sits at 12 or 6 o'clock, where the labels
  // would fight the widest part of the hub.
  const angle = (i / mathCategories.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / mathCategories.length / 2;
  return {
    cat,
    load: mathBranchLoad.get(cat.id) ?? 0,
    count: mathConcepts.filter((m) => m.category === cat.id).length,
    x: CORE.x + Math.cos(angle) * MATH_RING.rx,
    y: CORE.y + Math.sin(angle) * MATH_RING.ry
  };
});
const maxLoad = Math.max(...mathNodes.map((n) => n.load), 1);

for (const node of mathNodes) {
  const angle = Math.atan2(node.y - CORE.y, node.x - CORE.x);
  parts.push(`<line x1="${(CORE.x + Math.cos(angle) * (CORE.r + 7)).toFixed(1)}" y1="${(CORE.y + Math.sin(angle) * (CORE.r + 7)).toFixed(1)}" x2="${node.x.toFixed(1)}" y2="${node.y.toFixed(1)}" stroke="#ffc978" stroke-opacity="${(0.14 + (node.load / maxLoad) * 0.30).toFixed(2)}" stroke-width="${(0.9 + (node.load / maxLoad) * 1.4).toFixed(1)}"/>`);
}

mathNodes.forEach((node, i) => {
  const r = 6 + (node.load / maxLoad) * 6;
  parts.push(`<g class="branch" style="animation-delay:${(i * -1.1).toFixed(1)}s">`);
  parts.push(`<path d="M${node.x.toFixed(1)} ${(node.y - r - 4).toFixed(1)} L ${(node.x + r + 4).toFixed(1)} ${node.y.toFixed(1)} L ${node.x.toFixed(1)} ${(node.y + r + 4).toFixed(1)} L ${(node.x - r - 4).toFixed(1)} ${node.y.toFixed(1)} Z" fill="${node.cat.color}" fill-opacity="0.16"/>`);
  parts.push(`<path d="M${node.x.toFixed(1)} ${(node.y - r).toFixed(1)} L ${(node.x + r).toFixed(1)} ${node.y.toFixed(1)} L ${node.x.toFixed(1)} ${(node.y + r).toFixed(1)} L ${(node.x - r).toFixed(1)} ${node.y.toFixed(1)} Z" fill="${node.cat.color}" stroke="#061426" stroke-width="1.3"/>`);
  parts.push(`</g>`);

  // Two lines stacking away from the node, so neither lands on the diamond.
  const below = node.y >= CORE.y;
  const nameY = below ? node.y + r + 18 : node.y - r - 26;
  parts.push(`<text x="${node.x.toFixed(1)}" y="${nameY.toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#f4e3c4">${esc(node.cat.short)}</text>`);
  parts.push(`<text x="${node.x.toFixed(1)}" y="${(nameY + 14).toFixed(1)}" text-anchor="middle" font-size="10.5" fill="#b0966d">${node.load} links</text>`);
});

for (const [r, op] of [[CORE.r + 22, 0.14], [CORE.r + 11, 0.3]]) {
  parts.push(`<circle class="pulse" cx="${CORE.x}" cy="${CORE.y}" r="${r}" fill="none" stroke="#5de7ff" stroke-opacity="${op}" stroke-width="1"/>`);
}
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r}" fill="#061426"/>`);
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r}" fill="none" stroke="url(#coreEdge)" stroke-width="2"/>`);
parts.push(`<circle cx="${CORE.x}" cy="${CORE.y}" r="${CORE.r}" fill="none" stroke="#5de7ff" stroke-width="5" opacity="0.3" filter="url(#soft)"/>`);
parts.push(`<text x="${CORE.x}" y="${CORE.y - 6}" text-anchor="middle" font-size="34" font-weight="800" letter-spacing="-1.2" fill="#ffffff">AI</text>`);
parts.push(`<text x="${CORE.x}" y="${CORE.y + 14}" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1" fill="#8ba6c2">${concepts.length} CONCEPTS</text>`);
parts.push(`<text x="${CORE.x}" y="${CORE.y + 30}" text-anchor="middle" font-size="9.5" font-weight="700" letter-spacing="0.6" fill="#ffc978" opacity="0.95">ON ${mathConcepts.length} FOUNDATIONS</text>`);

parts.push(`<text x="${W / 2}" y="${H - 20}" text-anchor="middle" font-size="11.5" letter-spacing="2" fill="#5c7a99" opacity="0.9">AI CONCEPT ATLAS &#183; ${concepts.length} CONCEPTS &#183; ${categories.length} DOMAINS &#183; ${mathConcepts.length} MATHEMATICAL FOUNDATIONS</text>`);

/* ------------------------------------------------------------------ */

const style = `
text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.spark{animation:flow 9s linear infinite}
@keyframes flow{from{stroke-dashoffset:121}to{stroke-dashoffset:0}}
.pulse{animation:breathe 7s ease-in-out infinite alternate}
@keyframes breathe{from{stroke-opacity:.10}to{stroke-opacity:.42}}
.branch{animation:glimmer 8s ease-in-out infinite alternate}
@keyframes glimmer{from{opacity:.75}to{opacity:1}}
.orbit{animation:orbitfade 11s ease-in-out infinite alternate}
@keyframes orbitfade{from{stroke-opacity:.12}to{stroke-opacity:.34}}
@media (prefers-reduced-motion:reduce){.spark,.pulse,.branch,.orbit{animation:none}.spark{opacity:0}}
`.trim();

const alt = `Map of the AI Concept Atlas: ${categories.length} domains — `
  + `${categories.map((c) => c.name.toLowerCase()).join(", ")} — `
  + `each showing its best-known concepts, arranged around a central hub of ${concepts.length} concepts `
  + `encircled by the ${mathCategories.length} branches of mathematics they rest on: `
  + `${mathCategories.map((c) => c.short.toLowerCase()).join(", ")}.`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(alt)}">
<style>${style}</style>
${parts.join("\n")}
</svg>
`;

writeFileSync(join(ROOT, "assets/ai-concept-map.svg"), svg, "utf8");
const kb = (Buffer.byteLength(svg) / 1024).toFixed(1);
console.log(`assets/ai-concept-map.svg written — ${kb} KB, ${W}x${H}`);
console.log(`  ${concepts.length} concepts across ${categories.length} domains, ${mathConcepts.length} mathematics across ${mathCategories.length} branches`);
console.log(`  showing ${LANDMARKS} landmark concepts per domain:`);
for (const card of cards) {
  console.log(`    ${card.category.name.padEnd(32)} ${card.landmarks.map((c) => c.acronym).join(", ")}  (+${card.total - card.landmarks.length})`);
}
