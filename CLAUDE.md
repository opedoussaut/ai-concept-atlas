# Claude Code project brief — AI Concept Atlas

This file is the permanent instruction set for any agent or contributor working
on this repository. Read it before making changes.

---

## 1. Product

**AI Concept Atlas — From LoRA to MCP** is a public educational website that helps
professionals navigate essential AI terminology through a visual, searchable and
shareable concept map.

| | |
|---|---|
| Repository | `https://github.com/opedoussaut/ai-concept-atlas` |
| Public site | `https://opedoussaut.github.io/ai-concept-atlas/` |
| Default branch | `main` |
| Licence | MIT |

Audience: professionals who encounter AI vocabulary in meetings, documents and
tooling and need accurate, compact explanations they can share.

---

## 2. Architecture

Static HTML, CSS and vanilla JavaScript. **No build step, no package manager, no
runtime dependency.** Opening `index.html` from disk is a valid way to run the site.

```
index.html                  Markup, metadata, dialog template, page templates
styles.css                  All styling (single stylesheet, CSS custom properties)
app.js                      Search, filtering, routing, dialog, clipboard (one IIFE)
data.js                     Concept + category data (window.AI_CONCEPTS, window.AI_CATEGORIES)
math-data.js                Mathematics layer (window.MATH_CONCEPTS, window.MATH_CATEGORIES)
i18n.js                     Language selection, UI strings (en/fr), the localize() overlay fold
data-fr.js                  French overlay for the AI layer (window.AI_CONCEPTS_FR, window.AI_CATEGORIES_FR)
math-data-fr.js             French overlay for mathematics (window.MATH_CONCEPTS_FR, window.MATH_CATEGORIES_FR)
assets/                     favicon.svg, ai-concept-map.svg (hero), .png (social preview)
tools/validate.mjs          Zero-dependency validation script (also runs in CI)
tools/build-map.mjs         Regenerates assets/ai-concept-map.svg from data.js
tools/create-shortcut.ps1   Makes the Desktop launcher (run once, Windows)
assets/ai-atlas.ico         Multi-resolution icon for that shortcut
.github/workflows/pages.yml GitHub Pages build + deploy
```

**The hero map is generated, not drawn.** `tools/build-map.mjs` reads `data.js`
*and* `math-data.js` and emits `assets/ai-concept-map.svg` — eight domain cards
around a centre that carries the atlas's actual argument: a compact AI hub
encircled by the seven branches of mathematics the domains rest on. It is vector
(24 KB, sharp at any zoom) and can never drift out of sync with the data. After
adding or renaming a concept:

```bash
node tools/build-map.mjs
```

**The canvas is 1200×820 because that is roughly how large it is displayed.**
`.hero-visual` caps the hero at 1120px. An earlier version used a 1700px canvas,
so its 12.5px labels rendered at **8.2px** on screen — and ~7px on a laptop. It
was illegible, and worse, it looked like something you were meant to read. Keep
the canvas near its display size: 1 unit here should stay ≈ 1 CSS pixel.

**The map shows a sample, not an inventory.** Seventy-five labels cannot fit
legibly at this size, so each domain card names only its three best-connected
concepts and then says "+ N more in the atlas". The full list lives in the atlas
grid below, which is searchable, filterable and clickable — everything a picture
cannot be. **Prominence is earned by selection, never by dimming**: an earlier
attempt created hierarchy by fading the least-connected half to 5.7:1 contrast,
which at 8px turned the map into mush. Show fewer things brightly.

Three things are computed rather than styled by hand, and should stay that way:

- **Landmark choice.** Degree — how many other concepts declare a relationship —
  picks the three concepts shown per domain. Nobody hand-maintains that list.
- **Branch size.** Each mathematics diamond is sized by how many
  `mathFoundations` links point into that branch, so the picture shows what the
  AI layer actually leans on.
- **Ring rotation.** The seven branches are offset by half a step so no node
  sits at 12 or 6 o'clock, directly above or below the hub.

Domain names too long for a card wrap at their "&" rather than shrinking below
12px; the core radius is set so the gold "ON n FOUNDATIONS" line stays inside the
disc. Both are load-bearing — check them if you change any type size.

The validator no longer requires every concept to appear (the map is a sample by
design). Instead it checks that the `aria-label` names every domain, that every
domain contributes at least one visible concept, that all seven mathematics
branches are present, and that **both footer counts match the data** — which is
what catches a forgotten regeneration.

`assets/ai-concept-map.png` is a 1200×812 raster of the same map, kept only
because social crawlers will not render SVG. Regenerate it from the SVG at 2×
and downscale:

```bash
python3 -c "import cairosvg; cairosvg.svg2png(url='assets/ai-concept-map.svg', write_to='/tmp/og2x.png', output_width=2400)"
convert /tmp/og2x.png -resize 1200x812! -strip PNG24:assets/ai-concept-map.png
```

Do **not** verify the SVG with ImageMagick: it renders `radialGradient` with
`stop-opacity` as opaque and mangles `tspan` whitespace, so a perfectly good map
comes out as a solid blob. Use a real SVG renderer, or a browser.

`data.js`, `math-data.js`, `data-fr.js`, `math-data-fr.js`, `i18n.js` and `app.js`
are loaded as classic scripts at the end of `<body>`, in that order: the data
files publish the globals, the overlays publish theirs, `i18n.js` decides which
language is in force, and `app.js` folds them together exactly once.
There are currently **87 concepts across 8 domains** and **38 mathematics concepts
across 7 branches**, each with a primary reference.

**The mathematics layer is cross-cutting, not a ninth domain.** It is the answer to
"what mathematics is this built on", and it is navigable in both directions:

- AI → mathematics is declared **once**, on the AI concept, in `mathFoundations`.
- mathematics → AI is **derived at runtime** in `app.js` (`usedByMath`), never stored.

That asymmetry is deliberate. A stored reverse index is a second source of truth that
silently drifts; deriving it means the two directions cannot disagree. The validator
enforces that every forward link resolves and that no mathematics page is an orphan.

**The French layer is an overlay, not a translation of the site.** Three rules
hold it together, and each one exists because the alternative rots:

- **The URL is the only source of truth.** `?lang=fr` selects French; anything
  else, including `?lang=de`, is English. Nothing reads `navigator.language` and
  nothing is written to storage — so a shared link renders the same page for
  every reader, which is the entire premise of an atlas built on shareable deep
  links, and it keeps the footer's no-cookies promise literally rather than
  nearly true. Auto-detection was considered and rejected on exactly that basis.
- **Translations are an overlay keyed by slug**, holding only the fields that
  differ. There is no second array of concepts, so French cannot disagree with
  English about how many concepts exist or which relate to which. Same asymmetry
  as `usedByMath`: one record, one truth.
- **Localization happens once, at boot.** `i18n.localize()` folds the overlay in
  before `app.js` indexes anything, so search, cards, dialog, pages and graph all
  read an object that is already correct and never ask what language they are in.
  Changing language is a navigation that reloads the page; there is no live
  re-render path to get wrong.

**Missing French is a state, not a bug.** `localize()` leaves the English in
place and records the field in `_en`; `markLanguage()` then puts a small "EN"
chip on that section's heading and `setProse()` sets `lang="en"` on the body so
screen readers switch voice. That is what makes a phased translation shippable —
the site is never half-broken, only partly translated, and it says which parts.
Today the overlays carry `name` and `summary` for all 125 concepts; the four
explanation layers are still English.

**What is deliberately never translated:** `acronym` and `symbol`. LoRA is LoRA
and ∇ is ∇, and because the token chip sits next to the name on every card, a
name can be fully French without the reader losing the term they will actually
hear in a meeting. Established English practitioner terms stay English inside
French prose too — embedding, fine-tuning, token, prompt, softmax. Mathematical
vocabulary is the opposite case and translates properly, because French
mathematical terminology is settled: `dot product` → `produit scalaire`.

**Search is bilingual in both directions.** Each index entry carries an `alt`
field holding the concept's name in the *other* language, scoring just below the
displayed one at every tier. A French reader who has only seen "Retrieval-
Augmented Generation" in a paper finds it on the French site, and "apprentissage
profond" finds Deep Learning on the English one. Without it, the most likely
outcome is a reader concluding the atlas lacks something it plainly has.

`syncLanguageLinks()` is called at the **top** of `handleRoute()`, not the
bottom. Each route returns early, and an exception in any `open*` call must not
be able to strand the language links pointing at a page the reader already left.

**Search.** `app.js` builds an in-memory index at startup. Queries are normalized
(lower-cased, accent-folded, punctuation and hyphens collapsed to spaces), split
into tokens, matched with AND semantics, and ranked — exact acronym match scores
highest, then name/slug, prefixes, tags, domain, summary, then body prose. A
"compact" form (spaces removed) lets `chainofthought` and `vectordb` match. When
adding fields to a concept, decide deliberately whether they join the index.

**Atlas views.** Two tab-panels share one filter and search state:

- *Domains* (default) — concepts grouped into coloured bands, one per domain.
  Bands with no match are omitted entirely when searching or filtering.
- *Graph* — an SVG relationship map spanning **both layers**. 125 nodes: AI
  concepts as circles, mathematics as diamonds. 547 edges, each carrying a
  relation verb. Node radius scales with degree. The layout is a deterministic
  force simulation (`computeGraphLayout`): pairwise repulsion, springs weighted
  by edge strength, and a mild pull toward each group's anchor. Nodes are
  focusable and open on Enter — an AI node opens `#concept/<slug>`, a
  mathematics node opens `#math/<slug>`.

**Graph model.** Mathematics node ids are prefixed `math:` so the two slug
namespaces can never collide. Edges are undirected, deduplicated, and typed:

| Source | Relation | Weight | Layer class |
|---|---|---|---|
| `concept.related` | `RELATED_TO` | 1 | `edge-ai` |
| `mathFoundations`, primary | the maths concept's `relation` | 2 | `edge-bridge` |
| `mathFoundations`, supporting | the maths concept's `relation` | 1 | `edge-bridge-soft` |
| `math.prerequisites` | `DEPENDS_ON` | 2 | `edge-math` |
| `math.related` | `RELATED_TO` | 1 | `edge-math` |

Prerequisites are collected before plain relations so the stronger verb wins a
duplicated pair. Weight drives both spring strength and stroke opacity, which is
how 547 edges stay legible without hiding any of them.

**Three layer modes**, each with its **own cached layout**, simulated lazily on
first view: `both` (AI domains on an outer ring, mathematics branches on an inner
one — the picture reads as "the mathematics underneath"), `ai`, and `math`.
Switching modes never re-simulates a layout already computed; filtering and
searching only re-render.

**Focus view.** Selecting a concept in the focus control replaces the force graph
with a radial star: that concept at the centre, its *direct* mathematical
dependencies around it, and — this is the only place they fit — the relation verb
written on every edge. Core dependencies get a larger diamond. Only the 62
concepts that declare foundations appear in the selector.

Do not label edges in the force view. 547 labels is unreadable, which is exactly
the failure mode the original brief warned about.

**Three levels of depth** for one concept, all sharing the same data:

1. Card — acronym, name, summary.
2. Dialog at `#concept/<slug>` — the four explanation layers, a compact
   Mathematical foundations block, plus the reference.
3. Page at `#learn/<slug>` — the same content laid out full-width, with the full
   Mathematical foundations section, the optional `math` block and a prominent
   reference card.

**Four top-level panels**, mutually exclusive, switched only through `showView()`:
`atlasView`, `learnView`, `mathIndexView` and `mathView`. `handleRoute()` is fully
authoritative — given a hash it decides which single panel is showing — so a page
and the dialog can never be open at once, and a deep link opened cold resolves
through exactly the same function.

---

## 3. Visual design principles

The identity is **premium, technical and legible** — never decorative or game-like.

- Dark neon palette driven by CSS custom properties in `:root`
  (`--bg`, `--surface`, `--cyan`, `--blue`, `--violet`, `--green`, `--focus`).
- Each domain carries an accent colour from `AI_CATEGORIES[].color`, surfaced on
  cards through the `--card-accent` custom property.
- Large tight-tracked display type; generous whitespace; subtle glass surfaces
  (`backdrop-filter`) over a fixed gradient + grid background.
- Motion is minimal: short transforms and opacity transitions only. Everything is
  disabled under `prefers-reduced-motion: reduce`.
- Focus rings are a deliberate part of the design (`--focus`, `:focus-visible`),
  not a browser default to be suppressed.

Do not restyle working components without a stated technical reason.

---

## 4. Concept data structure

Every entry in `window.AI_CONCEPTS` follows this shape. All fields except
`source` are **required**.

```js
{
  slug: "qlora",                  // URL-safe kebab-case, unique, permanent
  acronym: "QLoRA",               // Display token; the acronym as written
  name: "Quantized Low-Rank Adaptation",  // Always the complete expansion
  category: "training",           // Must equal an id in window.AI_CATEGORIES
  summary: "…",                   // One sentence, shown on the card
  why: "…",                       // Why it matters
  how: "…",                       // How it works
  example: "…",                   // One concrete, practical example
  tags: ["quantization", "fine-tuning"],  // Search keywords
  related: ["lora", "peft"],      // Slugs that MUST exist
  source: {                       // Primary reference, HTTPS only
    label: "QLoRA: Efficient Finetuning of Quantized LLMs — Dettmers et al. (2023)",
    url: "https://arxiv.org/abs/2305.14314"
  },
  math: {                         // Optional; renders on #learn/<slug>
    intro: "One sentence framing the formulation.",
    formulas: [{
      label: "Low-rank weight update",
      expression: "W' = W_0 + ΔW = W_0 + B A",   // plain text, \n for line breaks
      note: "What each symbol means and why the form matters."
    }]
  }
}
```

Categories: `{ id, name, short, color }` — `color` must be a `#rrggbb` hex value.

**Mathematics fields on an AI concept.** Both optional; a concept without them shows
"not mapped yet" rather than an empty section.

```js
mathIntensity: "high",          // "low" | "medium" | "high"
mathNote: "…",                  // Required when there are no foundations
mathFoundations: [
  { slug: "matrix-rank", importance: "primary", note: "Why this matters here." }
]
```

A link may also carry `relation` to override the verb it would otherwise inherit
from the mathematics concept. Do this only when the general rule genuinely does
not hold — the point of storing the verb on the mathematics concept is that a
dot product is *always* something a technique computes with, and a vector space
is *always* the setting it presupposes. That is one decision instead of 141.

- **low** — a protocol, architecture, governance or software concept.
- **medium** — mathematics is used internally, but the concept can be understood
  without deriving it.
- **high** — the concept is directly defined by mathematical operations.

Do not assign mathematics to a concept where the relationship is not real. MCP,
tokenization, batching and guardrails are `low` and say so in `mathNote`; the
validator fails a concept that declares an intensity with neither foundations nor a
note. Do not chain: RAG declares cosine similarity, and cosine similarity declares
the dot product as a *prerequisite*. Repeating the whole chain on every concept
makes the layer noise.

### Mathematics concept data structure

Every entry in `window.MATH_CONCEPTS`. Required except `legend`, `worked`,
`prerequisites` and `source`.

```js
{
  slug: "matrix-rank",            // Routed at #math/<slug>. Permanent — never rename.
  symbol: "rank(A)",              // Display token; the counterpart of `acronym`
  name: "Matrix Rank",
  category: "linear-algebra",     // Must equal an id in window.MATH_CATEGORIES
  difficulty: "intermediate",     // introductory | intermediate | advanced
  relation: "DEPENDS_ON",         // How an AI concept relates to this; graph edge verb
  summary: "…",                   // One sentence, shown on the card
  intuition: "…",                 // Must stand alone without the equation
  equation: "rank(A) ≤ min(m, n)",// Plain text, \n for line breaks
  equationNote: "…",              // What the equation says, in words
  legend: [{ symbol: "m", meaning: "…" }],
  worked: "…",                    // Small numerical example, plain text
  whyInAI: ["…", "…"],            // Rendered as a list
  related: ["low-rank-factorization"],  // Mathematics slugs; must resolve
  prerequisites: ["matrices"],    // Mathematics slugs; must resolve
  tags: ["independence", "redundancy"],
  source: { label: "…", url: "https://…" }
}
```

`usedByConceptIds` is deliberately **absent** — it is derived, see §2.

**Rules for mathematics content**

1. The intuition must be readable by an engineer who is not a mathematician, and
   must work without the equation. An equation never replaces the explanation.
2. Worked examples are small, concrete and arithmetically correct. Check the numbers.
3. Never claim more than the mathematics supports.
4. Slugs are public URLs. `#math/<slug>` and `#learn/<slug>` are separate namespaces,
   but the validator warns on a collision because it confuses readers.

**On `source`.** All 87 concepts carry one. Prefer, in order: the paper that
introduced the idea, a DOI over a publisher URL (DOIs are permanent), official
documentation, then an authoritative survey. Every concept currently has a
*distinct* reference; the validator warns if two share one.

**On `math`.** Optional and deliberately dependency-free: expressions are plain
text in a `<pre><code>` block, not LaTeX, so the site still makes zero external
requests. Fifteen concepts carry one today — the transformer block and its parts
(`transformer`, `attention`, `activation-function`, `layer-normalization`,
`residual-connection`, `positional-encoding`), the efficient-attention line
(`linear-attention`, `flash-attention`, `speculative-decoding`), and
`next-token-prediction`, `diffusion`, `lora`, `dpo`, `embeddings`,
`quantization`. Concepts without it show a short note
pointing at the primary reference. Adding a maths library later is a real
decision — see principle 6.

**Rules for content**

1. Factual accuracy over fluency. Prefer a plain sentence to an impressive one.
2. Always give the full expansion of an acronym in `name`.
3. Explain through the four layers: definition (`summary`), `why`, `how`, `example`.
4. `slug` values are public URLs. **Never rename an existing slug** — that breaks
   every link already shared. Add a new concept instead.
5. `related` must always resolve to an existing slug; the validator enforces this.
6. References must be primary sources (papers, official documentation) over HTTPS.

---

## 5. Navigation and concept URLs

Four public routes, all stable contracts:

| Route | Effect |
|---|---|
| `#concept/<slug>` | Opens the dialog over the atlas |
| `#learn/<slug>` | Opens the full concept page, hiding the atlas |
| `#mathematics` | Opens the mathematics overview |
| `#math/<slug>` | Opens a mathematics concept page |

`?lang=fr` selects French and composes with all four, so
`…/?lang=fr#math/dot-product` is a valid public URL. It is a **query parameter,
not a route**: `history.pushState` with a hash-only relative URL preserves the
query for free, so navigation, the copy-link buttons and `absolute()` all carry
the language without a single extra line. Nothing else in this table changed —
an existing English deep link is byte-for-byte what it was.

- Example: `https://opedoussaut.github.io/ai-concept-atlas/#concept/qlora`.
- Opening a concept calls `history.pushState`, so browser back and forward move
  through the concepts the reader visited.
- `popstate` and `hashchange` both route through `handleRoute()`, which is
  idempotent: it opens one panel, opens the dialog, or closes both. `#math` and
  `#learn` win over `#concept`, so a page and the dialog can never be shown at once.
- A deep link opened cold is resolved once at startup by the same function.
- Closing the dialog pushes the bare path and restores focus to the element that
  opened it.
- A mathematics page opened from a concept remembers where it came from
  (`state.mathOrigin`) and offers "← Back to LoRA" instead of only
  "← All mathematics". The thread survives hops deeper into the mathematics
  layer, and clears the moment you open any AI concept, the overview, or the
  atlas. It is navigation state, not a route: a cold deep link has no origin and
  falls back to the index.
- `document.title` reflects the open concept, so shared links and browser history
  read meaningfully.

These URLs are a public contract. Preserve both forms.

---

**The desktop launcher opens the published site, not the working copy.**
`tools/create-shortcut.ps1` defaults to the canonical URL, because a link copied
from a `file://` page reads `file:///E:/users/…` and cannot be shared — which
defeats the point of an atlas built around shareable deep links. `-Local` exists
for offline use. The validator checks the launcher's URL against the canonical
in `index.html`, and **fails the build on any non-ASCII byte in the script**:
`powershell.exe` is still Windows PowerShell 5.1, which reads a `.ps1` as
Windows-1252, so a UTF-8 em dash arrives as three garbage bytes and the parser
dies pointing several characters away from the real problem. The sister GEN7
atlas shipped exactly that bug.

Because a local copy is a supported way to read this atlas, two things that
quietly assumed a server were fixed: `copyLink()` falls back to a hidden
textarea and `execCommand("copy")` when `navigator.clipboard` is unavailable,
and `absolute()` splits `location.href` at the hash rather than building from
`location.origin` — which on a `file://` page is the literal string `"null"`,
so every copied link came out as `null/E:/…/index.html#concept/qlora`.

**Cache busting.** `styles.css`, `data.js`, `math-data.js` and `app.js` are all
referenced with a shared `?v=<date>` token. GitHub Pages serves everything with
`max-age=600`, so without it a returning visitor can pair a fresh `index.html`
with a stale `app.js` and get a half-rendered page — which is exactly what
happened on the first mathematics-layer deployment. **Bump the token whenever any
of those four files changes.** The validator fails the build if they disagree,
because a partial bump is worse than none.

---

## 6. GitHub Pages deployment

`.github/workflows/pages.yml` runs on every push to `main` and on manual
`workflow_dispatch`.

- Permissions: `contents: read`, `pages: write`, `id-token: write`.
- Environment `github-pages`, publishing `steps.deployment.outputs.page_url`.
- Concurrency group `pages` with `cancel-in-progress: false` so a production
  deployment is never cancelled mid-flight.
- The **build** job validates the sources, then stages an explicit allow-list of
  files into `_site/` (`index.html`, `styles.css`, `app.js`, `data.js`, `assets/`).
  Nothing else is ever uploaded — not `.git`, `.github`, `.claude`, `tools/`, or
  local configuration.
- The **deploy** job consumes that artifact.

**One-time repository setting:** Settings → Pages → Build and deployment →
Source → **GitHub Actions**. Without it, `actions/configure-pages` fails with
"Get Pages site failed / Not Found". This cannot be set from the repository.

When bumping action versions, verify the tag actually exists before committing.

---

## 7. Validation requirements

Run before every commit:

```bash
node tools/build-map.mjs          # only if data.js changed
node tools/validate.mjs           # offline checks; this is what CI runs
node tools/validate.mjs --links   # additionally HEADs all 125 reference URLs
```

It checks required files, JavaScript syntax (`data.js` and `math-data.js`
evaluated in a VM, `app.js` parsed), the concept data model, unique and URL-safe
slugs, resolvable `related` slugs, valid category references and colours,
HTTPS-only sources with labels, well-formed `math` blocks, that the generated
concept map still contains every concept and domain, required HTML structure and
metadata, `rel="noopener noreferrer"` on every `target="_blank"`, local asset
existence, every element id `app.js` expects (via `getElementById` **or** the
`$()` helper), CSS brace balance and focus-visible presence, the workflow YAML
contract, and a secret scan. Exit code 1 means the change must not ship.

For the French layer it checks that every overlay key resolves to a slug that
still exists in the English data (a renamed slug silently orphans its French text
and the page quietly reverts, which is the failure this catches), that every
overlay field is a known non-empty string, that both `i18n.js` string tables carry
identical key sets, and that their `{placeholders}` and plural forms agree — a
placeholder present in one language prints literal braces at the reader. It warns
when a concept lacks a French name or summary, and when a French string is a
verbatim copy of its English original; strings that are legitimately identical are
listed by name in `SAME_BY_DESIGN` rather than the check being loosened.

For the mathematics layer it additionally checks the mathematics data model,
unique URL-safe mathematics slugs, valid branches and difficulty values,
resolvable `related` and `prerequisites`, that every `mathIntensity` is one of
low/medium/high, that every `mathFoundations` entry resolves to a real
mathematics concept with a valid `importance` and is not declared twice, that a
concept declaring an intensity has either foundations or a `mathNote`, and that
**no mathematics page is an orphan** — every one must be used by at least one AI
concept. It warns on a high-intensity concept with no primary mathematics, an
equation with no plain-language explanation, and a slug used by both layers.

`--links` reports failures as warnings only: publishers rate-limit and block
automated requests, so a red line there means "check by hand", not "broken".

Also confirm manually:

- `node --check app.js`, `node --check data.js`, `node --check math-data.js`
- Search for `MCP`, `QLoRA`, `RAG`, `JEPA`, and multi-word `retrieval augmented`
- Search for `dot product` and `softmax`: results must be labelled
  "Mathematics · <branch>" or "AI concept · <domain>", and route accordingly
- Both views: domain bands and the graph, including filtering in each
- Graph: all three layer modes; circles for AI and diamonds for mathematics;
  a mathematics node opens `#math/<slug>` and an AI node opens the dialog
- Graph focus: pick LoRA and confirm six labelled spokes reading
  "depends on / uses / optimized by"; pick Attention and confirm the same for
  dot product, matrix multiplication, softmax and vector spaces
- Direct navigation to `#concept/qlora` and `#learn/lora`; then back and forward
- Direct navigation to `#mathematics` and `#math/dot-product`; branch and
  difficulty filters; the overview's own search field
- Round trip both ways: LoRA → Matrix rank → back to LoRA from "AI concepts using it"
- `#learn/mcp` states "Core mathematical foundation: none." rather than showing
  an empty section
- Copy-link behaviour over HTTPS (the Clipboard API needs a secure context)
- `?lang=fr`: the FR/EN switch preserves the current route from every panel,
  a French deep link opened cold resolves, an English link is unchanged, and
  `?lang=de` falls back to English rather than rendering blanks
- In French, confirm the "EN" chip appears on Why/How/Example and on Intuitive
  explanation, and does **not** appear anywhere on the English site
- Keyboard-only pass: `/` focuses search, arrows move suggestions, Enter opens,
  Tab reaches graph nodes and Enter opens them, Escape closes, focus returns to
  the triggering card
- Desktop, tablet (≤1180px, ≤980px), and mobile (≤820px, ≤600px) layouts

---

## 8. Git workflow

1. Work directly on `main` unless a change is large or risky.
2. `git status` and `git diff` before staging. Read the diff.
3. Stage deliberately — never `git add -A` without reviewing what it caught.
4. Conventional commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
5. Run `node tools/validate.mjs` before committing.
6. `git push origin main`.

**Never commit:** `.claude/settings.local.json`, credentials, tokens, `.env`
files, or `_site/`. `.gitignore` covers these; keep it that way.

### Prohibited commands

These are destructive to shared history and are **not** permitted in this repository:

```
git push --force            git push --force-with-lease
git reset --hard            git rebase        (on pushed commits)
git commit --amend          (on pushed commits)
git filter-branch           git push --delete
git clean -fdx              (without explicit confirmation)
```

If history looks wrong, add a corrective commit. Do not rewrite what has been
pushed. Deleting files unrelated to the current task is equally out of bounds.

---

## 9. Product principles

1. Prioritize factual accuracy and concise explanations.
2. Use the full expansion of every acronym.
3. Explain each concept through four layers: definition, why it matters, how it
   works, and a concrete example.
4. Preserve stable deep links in the form `#concept/<slug>`.
5. Keep the interface premium, technical and legible rather than decorative or
   game-like.
6. Do not add a framework unless the benefit is clear **and** static deployment
   stays as simple as it is today.
7. Maintain keyboard access, semantic HTML, visible focus and responsive behaviour.
8. **No analytics, cookies, trackers or third-party requests.** The site loads
   only its own files. This is a stated promise in the footer.

---

## 10. Recommended next improvements

Every AI concept now carries a mathematics mapping and the validator runs clean
with **zero warnings**. Keep it that way: a new concept must arrive with a
`mathIntensity`, and either foundations or an honest `mathNote`.

- Write `math` blocks for the remaining concepts (15 of 87 done). This is the
  largest open content item. Less urgent than it was — `mathFoundations` already
  carries the conceptual link — so `math` is now only for a concept's *own*
  formulation, and only where one genuinely helps.
- Consider the folded mathematics concepts if any ever needs its own page:
  derivatives and partial derivatives live inside Gradients, the chain rule
  inside Backpropagation, SGD inside Gradient Descent, Monte Carlo inside
  Sampling. Splitting them today would create stubs, not pages.
- Add a glossary index and a compare mode for two concepts.
- Add downloadable PNG/PDF concept cards.
- Translate the four explanation layers into French. `data-fr.js` carries
  `name` and `summary` for all 87 concepts (and `math-data-fr.js` the same for
  all 38); `why`, `how`, `example`, `intuition`, `equationNote`, `worked` and
  `whyInAI` are still English and say so on the page. ~19,000 words remain.
  Nothing needs building first — add the field to the overlay and it renders.
- Add a third language if one is ever wanted. `i18n.js` takes a new code in
  `SUPPORTED` plus a string table and one more overlay file; nothing in `app.js`
  is language-specific.
- Consider persisting the chosen view, if it can be done without anything a
  reader would reasonably call tracking.
- Reassess plain-text formulas now that 38 mathematics pages carry equations. If
  they become unreadable, a **self-hosted** KaTeX build is the only option that
  keeps the no-third-party-requests promise — vendored into `assets/`, added to
  the workflow allow-list, never a CDN.

Done and no longer open: primary references (all 125), the per-concept page,
image weight (the hero is a generated 35 KB SVG rather than the original 1.78 MB
raster), the mathematics layer — 38 concepts, 261 typed links, both navigation
directions, its own overview and detail routes, the return breadcrumb, and
validator coverage — the two-layer relationship graph (125 nodes, 547 typed
edges, three cached layer layouts, a per-concept focus view), the hero map
rebuilt around the mathematics ring with degree-weighted concepts, and cache
busting across every local asset.

Also closed: the transformer block's own parts. The atlas named `transformer` and
`attention` but nothing a reader could drill into from them, so a `#learn/transformer`
page dead-ended at its own summary. `activation-function`, `layer-normalization`,
`residual-connection` and `positional-encoding` now sit between them, each with a
`math` block. Alongside those, the efficient-attention line that answers attention's
quadratic cost — `linear-attention`, `ssm`, `mla`, `gqa`, `flash-attention` — and the
inference concepts that explain *why* it exists: `prefill-and-decode`,
`memory-bandwidth-bound` and `speculative-decoding`. `outer-product` was added to the
mathematics layer to support them; it is the operation a fixed-size state uses to
write an association, and the reason a rank-r LoRA update needs so few parameters.

Two naming traps for anyone extending this line. The AI concept is `ssm`, not
`state-space-models` — that slug belongs to the mathematics layer, and the validator
warns on a collision across the two namespaces. And prefer the durable category over
the model of the moment: `ssm` covers Mamba, `linear-attention` covers DeltaNet and
its gated successors. Named frontier models date within a year, and slugs here are
permanent.
