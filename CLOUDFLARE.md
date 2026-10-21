# Cloudflare Pages deployment

The application is configured for **Pages with server-side rendering**, using `@sveltejs/adapter-cloudflare`. The public origin is `https://aleksandrgyumushyan.com`. Nothing in these preparation steps creates a Cloudflare project or changes DNS.

## Recommended: connect the Git repository

The local repository is on `main`, with no remote configured yet. Push it to your GitHub or GitLab repository, then in Cloudflare choose **Workers & Pages → Create → Pages → Connect to Git**. Use a Pages project, not the Workers deployment flow.

| Setting | Value |
| --- | --- |
| Project name | `aleksandr-portfolio` (or update `wrangler.jsonc` and the deploy script to match your chosen name) |
| Production branch | `main` |
| Framework preset | SvelteKit |
| Root directory | Repository root |
| Build command | `bun install --frozen-lockfile && bun run build:pages` |
| Build output directory | `.svelte-kit/cloudflare` |
| Build environment | Current/v3 build image |

Set these **build environment variables for production and preview**:

```text
BUN_VERSION=1.3.14
SKIP_DEPENDENCY_INSTALL=true
```

The checked-in `.node-version` pins Node 22.16.0. Skipping the automatic dependency install lets the build command install the committed Bun lockfile explicitly. No application secrets, database bindings, or runtime environment variables are needed. In preview branch controls, exclude `htmx-rewrite` while that experiment is paused.

`wrangler.jsonc` supplies the compatibility date and `nodejs_als` flag. The build command checks types, runs tests, generates optimized photos, builds the SSR function, and checks the Pages output and asset size limits. Images and compiled assets are routed directly to Pages rather than invoking the SSR function.

Use Git integration or Wrangler for this application so the generated `_worker.js` and its imports are bundled correctly.

## Verify before changing the domain

Open the `*.pages.dev` URL returned by Cloudflare. Check the homepage, About, Blog, all three articles, Photography, light/dark switch, image viewer, and an unknown URL (which should return 404). Preview hosts have indexing disabled; canonical URLs point to the real domain.

## Attach the domain at launch

1. Ensure `aleksandrgyumushyan.com` is an active Cloudflare zone in the same account as the Pages project. An apex domain requires Cloudflare nameservers; if it is already on Cloudflare, keep the existing nameservers. Preserve the zone’s existing mail and verification records.
2. Open the Pages project → **Custom domains → Set up a domain** and enter `aleksandrgyumushyan.com`. Let Pages create its DNS record. Adding a DNS record alone does not register the custom domain with Pages.
3. If the domain is attached to an older Pages project, move that association during cutover.
4. Optionally add `www.aleksandrgyumushyan.com` through the same Custom domains flow. Page requests on `www` redirect to the apex while preserving the path and query string.
5. Wait for the custom domain and HTTPS certificate to show **Active**, then verify the site on `https://aleksandrgyumushyan.com`.

The site includes canonical links, Open Graph URLs, `/sitemap.xml`, and `/robots.txt` for the production domain. Submit the sitemap to your search-console account after launch if you use one.

## Local production preview and optional CLI deployment

Wrangler requires a working Node installation (22.16.0 matches this project). Bun runs the application’s development, image processing, tests, and build.

```sh
bun install --frozen-lockfile
bun run build:pages
bun run preview
```

The preview runs at `http://localhost:4173` using the Pages runtime.

After the Pages project has been created, an authenticated CLI deployment is also available:

```sh
bunx wrangler login
bun run deploy
```

`bun run deploy` publishes the production branch to the configured Pages project. It does not attach the domain or alter DNS. Prefer Git integration for automatic future deployments; creating a Direct Upload project first prevents enabling Git integration on that same project later.

## References

- [SvelteKit on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/)
- [Pages build environment and version overrides](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Custom domains and apex nameservers](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Direct Upload and Git integration](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Pages Wrangler configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
