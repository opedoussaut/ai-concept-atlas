# AI Concept Atlas — From LoRA to MCP

A visual, searchable and shareable public website for navigating essential AI concepts.

**Live site:** https://opedoussaut.github.io/ai-concept-atlas/

## What it includes

- 71 concepts across 8 knowledge domains
- Full acronym expansions and concise explanations
- Four explanation layers per concept: definition, why it matters, how it works, concrete example
- Ranked search by acronym, full name, keyword, domain or partial text
- Related-concept navigation
- Shareable deep links such as `#concept/qlora`
- Responsive layout, keyboard navigation and visible focus states
- No framework, package manager or build step
- No analytics, cookies or third-party requests

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
node tools/validate.mjs
```

Zero dependencies. Checks file layout, JavaScript syntax, the concept data model,
unique slugs, related-link integrity, HTML metadata and accessibility contracts,
external-link safety, CSS sanity, the deployment workflow, and scans for secrets.
Exit code 1 means something must be fixed before shipping. The same script runs
in CI before every deployment.

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
- Edit appearance in `styles.css`.
- Replace `assets/ai-concept-map.png` with another social preview image.
- Update the canonical and Open Graph URLs in `index.html` if the site moves.

Never rename an existing `slug`: it is a public URL that others may already have shared.

## Accuracy note

The atlas is an educational overview, not a formal standard. Technical terms can
have context-dependent definitions. Primary references are included for 15 of the
71 concepts; contributions adding further official documentation and papers are
welcome.

## Contributing

See `CLAUDE.md` for architecture, data model, design principles, validation
requirements and the Git workflow.

## License

MIT — see `LICENSE`.
