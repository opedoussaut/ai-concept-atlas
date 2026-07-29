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
index.html                  Markup, metadata, dialog template
styles.css                  All styling (single stylesheet, CSS custom properties)
app.js                      Search, filtering, routing, dialog, clipboard (one IIFE)
data.js                     Concept + category data (window.AI_CONCEPTS, window.AI_CATEGORIES)
assets/                     favicon.svg, ai-concept-map.png (social preview)
tools/validate.mjs          Zero-dependency validation script (also runs in CI)
.github/workflows/pages.yml GitHub Pages build + deploy
```

`data.js` and `app.js` are loaded as classic scripts at the end of `<body>`.
`data.js` must load first: it publishes the two globals `app.js` consumes.
There are currently **71 concepts across 8 domains**.

**Search.** `app.js` builds an in-memory index at startup. Queries are normalized
(lower-cased, accent-folded, punctuation and hyphens collapsed to spaces), split
into tokens, matched with AND semantics, and ranked — exact acronym match scores
highest, then name/slug, prefixes, tags, domain, summary, then body prose. A
"compact" form (spaces removed) lets `chainofthought` and `vectordb` match. When
adding fields to a concept, decide deliberately whether they join the index.

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
  source: {                       // Optional, HTTPS only
    label: "QLoRA: Efficient Finetuning of Quantized LLMs — Dettmers et al. (2023)",
    url: "https://arxiv.org/abs/2305.14314"
  }
}
```

Categories: `{ id, name, short, color }` — `color` must be a `#rrggbb` hex value.

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

- Each concept has the stable deep link `#concept/<slug>` — e.g.
  `https://opedoussaut.github.io/ai-concept-atlas/#concept/qlora`.
- Opening a concept calls `history.pushState`, so browser back and forward move
  through the concepts the reader visited.
- `popstate` and `hashchange` both route through `handleRoute()`, which is
  idempotent: it opens the concept named in the hash, or closes the dialog.
- A deep link opened cold is resolved once at startup by the same function.
- Closing the dialog pushes the bare path and restores focus to the element that
  opened it.
- `document.title` reflects the open concept, so shared links and browser history
  read meaningfully.

These URLs are a public contract. Preserve the `#concept/<slug>` form.

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
node tools/validate.mjs
```

It checks required files, JavaScript syntax (`data.js` evaluated in a VM,
`app.js` parsed), the concept data model, unique and URL-safe slugs, resolvable
`related` slugs, valid category references and colours, HTTPS-only sources,
required HTML structure and metadata, `rel="noopener noreferrer"` on every
`target="_blank"`, local asset existence, every element id `app.js` expects,
CSS brace balance and focus-visible presence, the workflow YAML contract, and a
secret scan. Exit code 1 means the change must not ship.

Also confirm manually:

- `node --check app.js` and `node --check data.js`
- Search for `MCP`, `QLoRA`, `RAG`, `JEPA`, and multi-word `retrieval augmented`
- Direct navigation to `#concept/qlora`; then browser back and forward
- Copy-link behaviour over HTTPS (the Clipboard API needs a secure context)
- Keyboard-only pass: `/` focuses search, arrows move suggestions, Enter opens,
  Escape closes, focus returns to the triggering card
- Desktop, tablet (≤1180px), and mobile (≤820px, ≤600px) layouts

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

- Expand primary references beyond the current 15 of 71 concepts.
- Add a visual relationship graph mode alongside the card grid.
- Add a glossary index and a compare mode for two concepts.
- Add downloadable PNG/PDF concept cards.
- Add optional French localization.
- Compress `assets/ai-concept-map.png` (~1.8 MB, by far the heaviest asset).
