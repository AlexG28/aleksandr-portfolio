# Aleksandr Gyumushyan — personal website

A SvelteKit 3 + Svelte 5 + TypeScript site, built with Bun and configured for Cloudflare Pages with an SSR function. Pages are server-rendered at request time; this project does not use a static site generator or prerendering.

## Local development

```sh
bun install
bun run dev
```

Open the local URL printed by the development server. The development, check, and build scripts explicitly use Bun. Cloudflare’s Wrangler CLI (preview, type generation, authentication, and deployment) requires a working Node installation, version 22 or newer. The machine’s Homebrew Node installation had a missing library during setup; production runtime verification succeeded using the app’s bundled Node runtime without changing the system installation.

```sh
bun run check    # TypeScript and Svelte accessibility diagnostics
bun run test     # Article parsing and code-copy text checks
bun run build    # Production build for Cloudflare
bun run preview  # Serve the production build with the Cloudflare runtime
```

## Deploy to Cloudflare Pages

The production domain is `https://aleksandrgyumushyan.com`. See [CLOUDFLARE.md](CLOUDFLARE.md) for the exact dashboard settings, version pins, custom-domain setup, and launch checks.

- Build command: `bun install --frozen-lockfile && bun run build:pages`
- Build output directory: `.svelte-kit/cloudflare`
- Production branch: `main`
- Build environment: `BUN_VERSION=1.3.14`, `SKIP_DEPENDENCY_INSTALL=true`
- Runtime configuration: `wrangler.jsonc` (Pages, not Workers)

`bun run preview` serves the production build with the Pages runtime. `bun run deploy` builds and publishes to an existing Pages project after you authenticate. No deployment or DNS changes have been performed.

## Content

- About: `src/routes/about/+page.svelte`
- Article index and metadata: `src/lib/content/posts.json`
- Article bodies: `src/lib/content/<slug>.html`
- Optional photography descriptions and display order: `src/lib/content/photos.json`
- Automatic image processing: `scripts/photos.ts`
- Résumé PDF (linked from the header and footer): `static/resume/aleksandr_resume.pdf`
- Original photographs, portrait, and article diagrams: `static/images/`
- Shared design tokens and responsive styles: `src/app.css`

To add an article, add its metadata to `posts.json` and a matching HTML file. Code examples use `<pre data-code-language="go" data-code-title="Optional title"><code>…</code></pre>`; escape code as HTML. The article renderer provides syntax styling, line numbers, Copy, and Expand/Collapse controls. Article files are repository-controlled content rendered as HTML. Do not insert untrusted user input here. To add photographs, drop JPEG, PNG, WebP, AVIF, or TIFF files into `static/images/`. They are discovered automatically when starting development or building, and while the development server is running. Portrait and article images are excluded from the gallery. For a custom accessible description or display order, add the original `/images/filename.jpg` path and `alt` text to `photos.json`. Descriptions are not shown as captions.

Sharp generates responsive WebP files up to 2400 pixels wide, corrects camera orientation, strips metadata, and keeps the originals untouched. The gallery uses `srcset` and lazy loading; the image viewer loads a larger optimized version only when opened. Generated files are cached by content hash, ignored by Git, and regenerated before deployment. Run `bun run photos:prepare` to process them separately.

The three existing articles, twelve photographs, portrait, and public professional details were migrated from https://aleksandrgyumushyan.com/ on October 19, 2026. Original article URLs are preserved (with SvelteKit's default normalization of trailing slashes). Images and fonts are local, with no dependency on the old domain. The résumé is now available at the original `/resume/aleksandr_resume.pdf` URL. Replace that file to update it.

## Version control

Git is initialized on `main`. The first commit preserves the initial website; subsequent commits track refinements. No remote is configured.

## Interaction and accessibility

The header includes a light/dark theme toggle. It follows the system preference initially and remembers a manual choice across visits. Code highlighting has a separate contrast-adjusted palette for each theme.

The blog supports live title/topic search and an empty state. Photography uses a single gallery with a native modal dialog, previous/next controls, left/right arrow keys, Escape to close, focus restoration, and background scroll locking. Navigation, visible keyboard focus, a skip link, descriptive image labels, and reduced-motion styles are included.

No deployment has been performed. Follow `CLOUDFLARE.md` when ready to launch.
