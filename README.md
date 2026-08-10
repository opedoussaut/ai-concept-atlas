# AI Concept Atlas - From LoRA to MCP

A visual, searchable and shareable public website for navigating essential AI concepts.

**Live site:** https://opedoussaut.github.io/ai-concept-atlas/

## What it includes

- 75 concepts across 8 knowledge domains, each with a primary reference
- **Mathematics Behind AI** — 37 mathematical concepts across 7 branches,
  connected to the AI techniques that use them
- Full acronym expansions and concise explanations
- Four explanation layers per concept: definition, why it matters, how it works, concrete example
- Two atlas views: concepts grouped into domain bands, or a two-layer relationship
  graph — 112 nodes, 455 typed edges, filterable by layer or focused on one concept
- Ranked search across both layers, by acronym, symbol, full name, keyword, domain or partial text
- Shareable deep links: `#concept/<slug>` for the quick dialog, `#learn/<slug>` for the full page
- Responsive layout, keyboard navigation and visible focus states
- No framework, package manager or build step
- No analytics, cookies or third-party requests

## Three levels of depth

| Level | Where | Contains |
|---|---|---|
| Card | Atlas grid | Acronym, name, one-line summary |
| Dialog | `#concept/qlora` | Why / how / example, mathematical foundations, related concepts, reference |
| Page | `#learn/qlora` | The same, full width, plus the mathematical formulation |

## The mathematics layer

Mathematics is a **cross-cutting layer**, not a ninth domain. It answers "what is
this actually built on", and it is navigable in both directions.

| Level | Where | Contains |
|---|---|---|
| Overview | `#mathematics` | All 37 concepts by branch, with difficulty and usage filters |
| Page | `#math/matrix-rank` | Intuition, equation, symbol legend, worked example, and every AI concept that uses it |

Each AI concept carries a **mathematical intensity** — high, medium or low — and
a split between core and supporting mathematics. Concepts that are principally
software or protocol work say so plainly: `#learn/mcp` states that its core
mathematical foundation is none, and explains where the mathematics does live.

Round trip, from either end:

```
LoRA  →  Matrix rank  →  Low-rank factorization  →  LoRA, QLoRA, PEFT
```

Equations are plain text in a monospaced block — no maths library, no external
request, consistent with the no-third-party-requests promise.

## Français

Add `?lang=fr` to any URL and the atlas reads in French, including deep links:
`…/?lang=fr#math/dot-product`. There is an EN / FR switch in the header that
keeps you on the page you are already reading.

The language is decided by the URL alone — nothing is auto-detected from your
browser and nothing is stored — so a link you share renders the same page for
whoever opens it, and the "no cookies, no analytics, no tracking" line in the
footer stays literally true.

**The translation is complete.** All 125 concepts are fully French — names,
summaries, the why/how/example layers, the mathematical intuitions, equation
notes, worked examples, symbol legends and every one of the 261 notes explaining
why a given piece of mathematics matters to a given technique.

If a concept is ever added without its French text, that section renders in
English with a small **EN** marker on its heading rather than showing a hole, so
you always know which you are reading. Search works in both languages either way round — the
French site finds "retrieval augmented", the English site finds "apprentissage
profond".

Acronyms and mathematical symbols are never translated. LoRA stays LoRA, ∇ stays
∇, and established practitioner vocabulary — embedding, fine-tuning, token,
prompt, softmax — stays in English inside the French text, because that is how
French-speaking practitioners actually talk. Mathematical terminology is the
opposite: it is settled in French, so it is translated properly.

## The Dojo

A one-shot quiz at [`#quiz`](https://opedoussaut.github.io/ai-concept-atlas/#quiz).
Pick 10, 25, 50 or 100 questions, answer as well as you can, and earn a judo
belt: white, yellow, orange, green, blue, brown, black. Brown and black are only
awarded on the 100-question run.

Questions are generated from the atlas data — acronyms, domains, relationships,
mathematical foundations, symbols, prerequisites, relation verbs and difficulty —
so they are different every time, work in both languages, and can never
contradict the atlas. Adding a concept adds questions by itself.

Nothing is stored. No score, no account, no cookie, no leaderboard. A run lives
in the page and dies with it, which is the same promise as the rest of the site.

Earn a black belt and the dojo opens one more door: a hundred hard-only
questions graded across the ten dan, from Shodan to Judan. Black belt for 1st
to 5th dan, the red-and-white kōhaku obi for 6th to 8th, red for 9th and 10th.
Almost nobody sees the tenth.

It is built as a dojo rather than a quiz screen. A tatami floor, the belt wall
hanging where you can read it before you commit, a bow — 礼 — between choosing
your run and the first question, the judo calls during play (`waza-ari` at three
in a row, `ippon` at five), and `sore made` before the belt is tied on and the
grade announced. Grades carry their real names: 白帯 Shiro-obi at 6th kyū up to
黒帯 Kuro-obi, then 初段 Shodan through 十段 Judan.

Playable entirely from the keyboard: Enter to bow in, 1–4 to answer, Enter to
continue.

## The relationship graph spans both layers

Circles are AI concepts, diamonds are mathematics. Every edge is a relationship
declared in the data, typed with a verb: `USES`, `DEPENDS_ON`, `MEASURED_WITH`,
`OPTIMIZED_BY`, `APPROXIMATES` or `RELATED_TO`.

- **Both layers** — the eight AI domains on an outer ring, the seven mathematics
  branches on an inner one.
- **AI only** / **Mathematics only** — one layer at a time, each with its own layout.
- **Focus** — pick a concept and the graph becomes a labelled star of just that
  concept and the mathematics it depends on directly:

```
LoRA
 ├── DEPENDS_ON   → Matrix Rank
 ├── USES         → Low-Rank Factorization
 ├── USES         → Matrix Multiplication
 ├── DEPENDS_ON   → Matrices
 ├── DEPENDS_ON   → Vector Spaces
 └── OPTIMIZED_BY → Gradient Descent
```

Edge verbs are only drawn in the focus view. Labelling all 455 at once would make
the graph unreadable, so weight and colour carry the structure instead.

## Desktop shortcut

```powershell
powershell -ExecutionPolicy Bypass -File "tools\create-shortcut.ps1"
```

Puts an **AI Concept Atlas** icon on the Desktop that opens the published site
in its own window — no address bar, no tabs. Right-click it and *Pin to taskbar*
to keep it there; Windows will not let a script do that last step for you.

It opens the **published** atlas by default, not your working copy. This atlas
exists to be shared, and a link copied from a local file reads
`file:///E:/users/…`, which is useless to anyone else. Add `-Local` if you want
the working copy instead — on a plane, or to check a change before pushing.

The shortcut targets Chrome or Edge in `--app=` mode rather than a URL or the
`.html` file, because Windows only pins shortcuts whose target is an executable.

## Run locally

Open `index.html` directly, or start a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

**Copy concept link works either way.** The Clipboard API needs a secure context
(`https://` or `localhost`), so off `file://` the button falls back to a hidden
textarea and `execCommand("copy")` — deprecated, but this is precisely the case
it still exists for.

## The hero map is generated

`assets/ai-concept-map.svg` is not hand-drawn — it is built from `data.js` and
`math-data.js`:

```bash
node tools/build-map.mjs
```

Eight domain cards around a centre that states the argument: a compact AI hub
encircled by the seven branches of mathematics the domains rest on, each sized
by how heavily the AI layer leans on it. Each card names its three best-connected
concepts and points to the rest — the canvas is sized to its display width, so every label stays legible.

24 KB of vector, sharp at any zoom, in the site's own palette, and impossible to
leave out of date: the validator fails if a domain or mathematics branch goes
missing, or if either footer count stops matching the data. The `.png` beside it
is a raster of the same map, kept only because social crawlers do not render SVG.

## Validate

```bash
node tools/validate.mjs           # offline checks — this is what CI runs
node tools/validate.mjs --links   # also checks all 112 reference URLs respond
```

Zero dependencies. Checks file layout, JavaScript syntax, the concept data model,
unique slugs, related-link integrity, reference and math-block shape, HTML
metadata and accessibility contracts, external-link safety, CSS sanity, the
deployment workflow, and scans for secrets. Exit code 1 means something must be
fixed before shipping.

For the mathematics layer it also checks that every AI → mathematics link
resolves, that intensities and importances are valid, that a concept declaring an
intensity explains itself either through foundations or a note, and that **no
mathematics page is an orphan** — every one must be reachable from at least one
AI concept.

`--links` is opt-in and reports problems as warnings: academic publishers often
block automated requests, so a flagged link is worth a manual look rather than
an automatic failure.

## Deployment

Pushing to `main` triggers `.github/workflows/pages.yml`, which validates the
sources, stages an allow-list of published files into `_site/`, and deploys to
GitHub Pages.

**Required one-time repository setting:**
Settings → Pages → Build and deployment → Source → **GitHub Actions**.

Without it the workflow fails at `actions/configure-pages` with
"Get Pages site failed / Not Found".

## Customize

- Edit concept content in `data.js` (see `CLAUDE.md` § 4 for the required shape).
- Edit mathematics content in `math-data.js` (same section for its shape).
- Edit French content in `data-fr.js` and `math-data-fr.js`. These are overlays
  keyed by the same slug, holding only the fields that differ — not copies of the
  data. Leave a field out and it renders in English, marked as such. Interface
  strings live in `i18n.js`, where both language tables must carry the same keys.
- Add a `math` block to a concept and its formulation appears on `#learn/<slug>`.
- Link a concept to mathematics with `mathIntensity` and `mathFoundations`. The
  reverse direction — which AI concepts use a given piece of mathematics — is
  derived at runtime, so it can never fall out of sync.
- Run `node tools/build-map.mjs` to regenerate the hero map from the data.
- Edit appearance in `styles.css`.
- Update the canonical and Open Graph URLs in `index.html` if the site moves.

Never rename an existing `slug`: it is a public URL that others may already have shared.

## Accuracy note

The atlas is an educational overview, not a formal standard. Technical terms can
have context-dependent definitions. Every concept links to a primary reference —
the paper that introduced it, or official documentation — and that reference is
the authority, not this summary. Corrections are welcome.

## Contributing

See `CLAUDE.md` for architecture, data model, design principles, validation
requirements and the Git workflow.

## License

MIT — see `LICENSE`.
