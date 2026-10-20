import { error } from '@sveltejs/kit';
import { parseArticle } from '#lib/article.ts';
import posts from '#lib/content/posts.json';
import type { PageServerLoad } from './$types';
const articles = import.meta.glob('/src/lib/content/*.html', { query: '?raw', import: 'default' });
export const load: PageServerLoad = async ({ params }) => {
 const post = posts.find(post => post.slug === params.slug);
 if (!post) error(404, 'Article not found');
 const body = await articles[`/src/lib/content/${post.slug}.html`]();
 return { post, blocks: parseArticle(body as string), next: posts[(posts.indexOf(post)+1)%posts.length] };
};
