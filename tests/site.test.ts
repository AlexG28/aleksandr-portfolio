import { expect, test } from 'bun:test';
import { handle } from '../src/hooks.server';

function request(url: string) {
 return handle({ event: { url: new URL(url) }, resolve: async () => new Response('ok') } as Parameters<typeof handle>[0]);
}

test('www redirects to the canonical origin, preserving path and query', async () => {
 await expect(request('https://www.aleksandrgyumushyan.com/blog?x=1')).rejects.toMatchObject({
  status: 308, location: 'https://aleksandrgyumushyan.com/blog?x=1'
 });
});
test('Pages preview hosts are noindex and are not redirected to production', async () => {
 const response = await request('https://preview.aleksandr-portfolio.pages.dev/blog');
 expect(response.status).toBe(200);
 expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
});
test('production remains indexable', async () => {
 const response = await request('https://aleksandrgyumushyan.com/blog');
 expect(response.status).toBe(200);
 expect(response.headers.get('X-Robots-Tag')).toBeNull();
});
