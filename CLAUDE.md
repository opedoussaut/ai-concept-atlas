# Claude Code project brief

## Product

**AI Concept Atlas — From LoRA to MCP** is a public educational website that helps professionals navigate essential AI terminology through a visual, searchable and shareable concept map.

## Current implementation

- Static HTML, CSS and vanilla JavaScript
- No build step or external dependency
- 71 concept records in `data.js`
- Search, domain filters, detail dialog, related links, deep links and copy-link action
- Responsive layout and reduced-motion support
- GitHub Pages workflow included

## Product principles

1. Prioritize factual accuracy and concise explanations.
2. Use the full expansion of every acronym.
3. Explain each concept through four layers: definition, why it matters, how it works and a concrete example.
4. Preserve stable deep links in the form `#concept/<slug>`.
5. Keep the interface premium, technical and legible rather than decorative or game-like.
6. Do not add a framework unless the benefit is clear and the static deployment remains simple.
7. Maintain keyboard access, semantic HTML and responsive behavior.

## Recommended next improvements

- Verify and expand primary references for every concept.
- Add a visual relationship graph mode alongside the current card grid.
- Add a glossary index and compare mode for two concepts.
- Add downloadable PNG/PDF concept cards.
- Add optional French localization.
- Replace the placeholder GitHub URL in `index.html` with the final repository URL.
- Add the final deployed URL to Open Graph metadata.

## Validation checklist

- `node --check app.js`
- `node --check data.js`
- Test search for `MCP`, `QLoRA`, `RAG` and `JEPA`.
- Test direct navigation to `#concept/qlora`.
- Test copy-link behavior on HTTPS.
- Test desktop, tablet and mobile layouts.
- Verify that every `related` slug in `data.js` exists.
