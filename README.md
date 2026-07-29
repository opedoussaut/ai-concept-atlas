# AI Concept Atlas — From LoRA to MCP

A visual, searchable and shareable public website for navigating essential AI concepts.

## What it includes

- 8 knowledge domains and 60+ concepts
- Acronym expansions and concise explanations
- “Why it matters”, “How it works” and concrete examples
- Search by acronym, full name or keyword
- Related-concept navigation
- Shareable deep links such as `#concept/qlora`
- Responsive layout and keyboard navigation
- GitHub Pages deployment workflow
- No framework, package manager or build step required

## Run locally

Open `index.html` directly, or start a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a new public GitHub repository, for example `ai-concept-atlas`.
2. Upload or push all files in this folder to the repository's `main` branch.
3. In **Settings → Pages**, set **Source** to **GitHub Actions**.
4. The included workflow deploys the site automatically.
5. Replace the generic GitHub URL in `index.html` with your repository URL.

Typical commands:

```bash
git init
git add .
git commit -m "Launch AI Concept Atlas"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ai-concept-atlas.git
git push -u origin main
```

## Customize

- Edit concept content in `data.js`.
- Edit appearance in `styles.css`.
- Replace `assets/ai-concept-map.png` with another social preview image.
- Update Open Graph metadata in `index.html` before sharing on LinkedIn.

## Accuracy note

The atlas is an educational overview, not a formal standard. Technical terms can have context-dependent definitions. Primary references are included for several foundational concepts; adding further official documentation and papers is encouraged.

## License

MIT
