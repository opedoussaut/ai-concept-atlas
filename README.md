# AI Concept Atlas - From LoRA to MCP

A visual, searchable and shareable public website for navigating essential AI concepts.

**Live site:** https://opedoussaut.github.io/ai-concept-atlas/

## What it includes

- 71 concepts across 8 knowledge domains, each with a primary reference
- Full acronym expansions and concise explanations
- Four explanation layers per concept: definition, why it matters, how it works, concrete example
- Two atlas views: concepts grouped into domain bands, or an interactive relationship graph
- Ranked search by acronym, full name, keyword, domain or partial text
- Shareable deep links: `#concept/<slug>` for the quick dialog, `#learn/<slug>` for the full page
- Mathematical formulations on the concepts that have them
- Responsive layout, keyboard navigation and visible focus states
- No framework, package manager or build step
- No analytics, cookies or third-party requests

## Three levels of depth

| Level | Where | Contains |
|---|---|---|
| Card | Atlas grid | Acronym, name, one-line summary |
| Dialog | `#concept/qlora` | Why / how / example, related concepts, reference |
| Page | `#learn/qlora` | The same, full width, plus the mathematical formulation |

Concepts that do not yet have a written mathematical treatment link to their
primary reference instead.

## Run locally

Open `index.html` directly, or start a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

A local server is preferable for testing the **Copy concept link** button: the
Clipboard API requires a secure context (`https://` or `localhost`).

## Validate

```bash
node tools/validate.mjs           # offline checks — this is what CI runs
node tools/validate.mjs --links   # also checks all 71 reference URLs respond
```

Zero dependencies. Checks file layout, JavaScript syntax, the concept data model,
unique slugs, related-link integrity, reference and math-block shape, HTML
metadata and accessibility contracts, external-link safety, CSS sanity, the
deployment workflow, and scans for secrets. Exit code 1 means something must be
fixed before shipping.

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
- Add a `math` block to a concept and its formulation appears on `#learn/<slug>`.
- Edit appearance in `styles.css`.
- Replace both `assets/ai-concept-map.webp` (page) and `.png` (social preview).
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
