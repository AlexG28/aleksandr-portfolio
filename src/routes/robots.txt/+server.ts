import { SITE_URL } from '#lib/site.ts';
export function GET({ url }: { url: URL }) {
 const policy = url.hostname.endsWith('.pages.dev') ? 'Disallow: /' : 'Allow: /';
 return new Response(`User-agent: *\n${policy}\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' }
 });
}
