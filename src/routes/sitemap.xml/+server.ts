import posts from '#lib/content/posts.json';
import { canonicalUrl } from '#lib/site.ts';

export function GET() {
 const paths = ['/', '/about', '/blog', '/photography', ...posts.map(post => `/blog/${post.slug}`)];
 const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => ` <url><loc>${canonicalUrl(path)}</loc></url>`).join('\n')}\n</urlset>\n`;
 return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
