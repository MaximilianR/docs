# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start          # Start local dev server (hot reload)
yarn build          # Build static site to build/
yarn serve          # Serve the built site locally
yarn clear          # Clear Docusaurus cache
yarn typecheck      # TypeScript type checking
yarn sync-deployments  # Sync docs/deployments.json to src/data/ and static/
```

No test suite exists in this repo. Use `yarn build` to validate changes (catches broken links, bad imports, MDX errors). The build config uses `onBrokenLinks: 'warn'` and `onBrokenMarkdownLinks: 'warn'`, so broken links show as warnings rather than build failures.

Requires Node >= 18.

## Architecture

This is a **Docusaurus 3** documentation site for Curve Finance (`docs.curve.finance`). It uses TypeScript, React, MDX, KaTeX (math rendering), and Mermaid (diagrams).

### Two Doc Sections (Separate Plugins)

The site serves two distinct documentation trees:

| Section | Source Dir | Route Base | Sidebar |
|---|---|---|---|
| **Users** (preset) | `docs/user/` | `/user/` | `sidebars/sidebarUser.js` |
| **Protocol/Build On Curve** (plugin) | `docs/protocol/` | `/protocol/` | `sidebars/sidebarProtocol.js` |

Sidebars are manually defined in the `sidebars/` directory — not auto-generated. When adding a new doc, you must also add it to the relevant sidebar file.

Doc files are `.md` (not `.mdx`), but MDX features (JSX, imports) are still supported since Docusaurus processes all markdown through MDX.

### Key Config Files

- `docusaurus.config.ts` — main site config, plugins, navbar, Algolia search
- `sidebars/sidebarUser.js` — sidebar for the user-facing docs
- `sidebars/sidebarProtocol.js` — sidebar for the protocol/builder docs
- `src/config/ghost.ts` — Ghost CMS integration config (blog posts shown on homepage)

### Deployments Data

`docs/deployments.json` is the **source of truth** for contract addresses. After editing it, run `yarn sync-deployments` to propagate changes to `src/data/deployments.json` and `static/deployments.json`. All three must stay in sync.

### Markdown Features

- **Math**: Use KaTeX syntax — inline `$...$` and display `$$...$$` blocks (via `remark-math` + `rehype-katex`)
- **Diagrams**: Use Mermaid code blocks (``` ```mermaid ```) — rendered by `@docusaurus/theme-mermaid`
- **Logo shortcodes**: Write `:logos-<name>:` in markdown to render an inline SVG from `static/img/logos/<name>.svg` (handled by the `remark-logos.js` plugin)
- **Custom admonitions**: Beyond standard Docusaurus admonitions (`note`, `tip`, `info`, `caution`, `danger`), these extra keywords are configured: `tip-green`, `example`

### Custom React Components

Live on-chain data components are in `src/components/LiveComponents/` — they fetch from Ethereum via `ethers.js` using a public RPC (`https://eth.llamarpc.com`). These are embedded directly in MDX files.

Chart components (Chart.js-based) live in `src/components/Charts/`.

The `src/utils/formatters.js` utility provides `formatNumber()` for formatting large numbers with k/M/B suffixes.

### Integrations & Plugins

- **Algolia** — site search with AI assistant (`askAi` config in `docusaurus.config.ts`)
- **Ghost CMS** — blog posts fetched for the homepage; configured in `src/config/ghost.ts`
- **Plausible** — analytics via `docusaurus-plugin-plausible`
- **Formspree** — feedback endpoint injected at build time
- **Swagger UI** — `swagger-ui-react` available for API reference pages
- **Client modules** — `src/clientModules/latestPopup.js` runs client-side (announcement popup)

### Custom CSS

CSS is modular and imported in `src/css/custom.css`:
- `design-tokens.css` + `theme-tokens.css` — design system variables
- `admonitions.css` — custom admonition types (`tip-green`, `example`, etc.)
- Other partials for homepage, navigation, guide cards

### Moved Pages

`src/pages/moved.tsx` renders a redirect notice for users coming from the old `resources.curve.finance` URL.
