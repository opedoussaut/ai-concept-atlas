/**
 * Generates assets/atlas-update-promo.svg — the social card for an update post.
 *
 * Generated rather than drawn, for the same reason the hero map is: the numbers
 * on it are read from the data files, so the card cannot claim 73 concepts
 * while the atlas holds 87. Re-run it after any content change:
 *
 *   node tools/build-promo.mjs
 *
 * 1080 x 1350 — LinkedIn's portrait slot, which is the largest a feed image is
 * shown at. Everything is vector and the palette is the site's own, so the card
 * and the page a reader lands on look like the same thing.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const box = { window: {} };
vm.createContext(box);
for (const f of ["data.js", "math-data.js", "tools-data.js", "quiz.js"]) {
  vm.runInContext(readFileSync(join(ROOT, f), "utf8"), box);
}
const W = box.window;
const concepts = W.AI_CONCEPTS, maths = W.MATH_CONCEPTS, tools = W.ATLAS_TOOLS;
const links = concepts.reduce((n, c) => n + (c.mathFoundations ?? []).length, 0);

/* The site's palette, so the card and the page match. */
const C = {
  text: "#f4f8ff", muted: "#a9b8ca", cyan: "#5de7ff", violet: "#b58cff",
  gold: "#ffc978", green: "#6ce6af", line: "rgba(157,210,255,.17)"
};
const SANS = "DejaVu Sans, Liberation Sans, sans-serif";
const JP = "Noto Serif CJK JP, serif";
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

/* A belt, the same knotted object the Dojo awards. */
const belt = (x, y, w, colour) => {
  const s = w / 88;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="2" y="9" width="84" height="9" rx="1.5" fill="${colour}" stroke="rgba(255,255,255,.28)" stroke-width=".8"/>
    <rect x="34" y="5" width="20" height="16" rx="2" fill="${colour}" stroke="rgba(255,255,255,.32)" stroke-width=".8"/>
    <path d="M39 21 L36 29 L43 26 Z" fill="${colour}" stroke="rgba(0,0,0,.25)" stroke-width=".5"/>
    <path d="M49 21 L52 29 L45 26 Z" fill="${colour}" stroke="rgba(0,0,0,.25)" stroke-width=".5"/>
  </g>`;
};

/* One feature row: motif, title, supporting line. */
const feature = (y, motif, title, line, accent) => `
  <g>
    <rect x="72" y="${y}" width="936" height="132" rx="18" fill="rgba(255,255,255,.028)" stroke="${C.line}"/>
    <rect x="72" y="${y}" width="4" height="132" rx="2" fill="${accent}"/>
    ${motif(112, y + 40)}
    <text x="232" y="${y + 56}" font-family="${SANS}" font-size="34" font-weight="bold" fill="${C.text}">${esc(title)}</text>
    <text x="232" y="${y + 96}" font-family="${SANS}" font-size="24" fill="${C.muted}">${esc(line)}</text>
  </g>`;

const stat = (x, value, label) => `
  <g>
    <text x="${x}" y="1116" font-family="${SANS}" font-size="56" font-weight="bold" fill="${C.cyan}" text-anchor="middle">${esc(value)}</text>
    <text x="${x}" y="1154" font-family="${SANS}" font-size="21" fill="${C.muted}" text-anchor="middle">${esc(label)}</text>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"
  role="img" aria-label="A major update to the AI Concept Atlas: a complete French edition, the Dojo, and the Workshop. ${concepts.length} AI concepts, ${maths.length} mathematical foundations, ${links} links between them. Free, with no account and no tracking.">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#07111f"/><stop offset="0.58" stop-color="#050b14"/><stop offset="1" stop-color="#03070d"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.5" cy="0.16" r="0.5">
      <stop offset="0" stop-color="#1a66b4" stop-opacity=".26"/><stop offset="1" stop-color="#1a66b4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.9" cy="0.72" r="0.42">
      <stop offset="0" stop-color="#7f47c0" stop-opacity=".2"/><stop offset="1" stop-color="#7f47c0" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="rgba(113,177,233,.13)" stroke-width="1"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.2" stop-color="#fff" stop-opacity=".55"/>
      <stop offset="0.8" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="gridMask"><rect width="1080" height="1350" fill="url(#fade)"/></mask>
  </defs>

  <rect width="1080" height="1350" fill="url(#bg)"/>
  <rect width="1080" height="1350" fill="url(#grid)" mask="url(#gridMask)"/>
  <rect width="1080" height="1350" fill="url(#glowA)"/>
  <rect width="1080" height="1350" fill="url(#glowB)"/>

  <rect x="72" y="80" width="228" height="46" rx="12" fill="rgba(93,231,255,.12)" stroke="rgba(93,231,255,.45)"/>
  <text x="186" y="110" font-family="${SANS}" font-size="21" font-weight="bold" letter-spacing="3.2"
        fill="${C.cyan}" text-anchor="middle">NEW UPDATE</text>

  <text x="72" y="234" font-family="${SANS}" font-size="86" font-weight="bold" fill="${C.text}">Learn it. Test it.</text>
  <text x="72" y="332" font-family="${SANS}" font-size="86" font-weight="bold" fill="${C.violet}">Then go and build.</text>

  <text x="72" y="404" font-family="${SANS}" font-size="27" fill="${C.muted}">Three new sections in the AI Concept Atlas.</text>
  <text x="72" y="446" font-family="${SANS}" font-size="27" fill="${C.muted}">Free. No account, no cookies, no tracking.</text>

  ${feature(524,
    (x, y) => `<g>
      <rect x="${x}" y="${y - 4}" width="84" height="60" rx="14" fill="rgba(93,231,255,.1)" stroke="rgba(93,231,255,.4)"/>
      <text x="${x + 42}" y="${y + 36}" font-family="${SANS}" font-size="30" font-weight="bold" fill="${C.cyan}" text-anchor="middle">FR</text>
    </g>`,
    "A complete French edition",
    `All ${concepts.length + maths.length} concepts. Add ?lang=fr to any link.`, C.cyan)}

  ${feature(676,
    (x, y) => `<g>
      ${belt(x, y - 18, 84, "#eceff1")}
      ${belt(x, y + 8, 84, "#7b4b2a")}
      ${belt(x, y + 34, 84, "#15181c")}
    </g>`,
    "The Dojo",
    "A quiz built from the atlas, graded as a judo belt.", C.gold)}

  ${feature(828,
    (x, y) => `<g>${W.TOOL_CATEGORIES.map((cat, i) =>
      `<rect x="${x}" y="${y - 12 + i * 13}" width="${34 + tools.filter((t) => t.category === cat.id).length * 6}" height="8" rx="4" fill="${cat.color}" opacity=".85"/>`).join("")}</g>`,
    "The Workshop",
    `${tools.length} places worth knowing, sorted by the question you have.`, C.violet)}

  <line x1="72" y1="1008" x2="1008" y2="1008" stroke="${C.line}"/>
  ${stat(228, String(concepts.length), "AI concepts")}
  ${stat(540, String(maths.length), "mathematical foundations")}
  ${stat(852, String(links), "links between them")}

  <text x="540" y="1248" font-family="${SANS}" font-size="30" font-weight="bold" fill="${C.text}" text-anchor="middle">opedoussaut.github.io/ai-concept-atlas</text>
  <text x="540" y="1294" font-family="${JP}" font-size="22" fill="${C.gold}" text-anchor="middle" opacity=".8">道場 · L’Atelier · The Workshop</text>
</svg>
`;

writeFileSync(join(ROOT, "assets/atlas-update-promo.svg"), svg);
console.log(`assets/atlas-update-promo.svg — ${concepts.length} concepts, ${maths.length} maths, ${links} links, ${tools.length} workshop entries`);
