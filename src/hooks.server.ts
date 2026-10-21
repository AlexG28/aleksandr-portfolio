import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { SITE_HOST, SITE_URL } from '#lib/site.ts';

export const handle: Handle = async ({ event, resolve }) => {
 if (event.url.hostname === `www.${SITE_HOST}` ||
  (event.url.hostname === SITE_HOST && event.url.protocol !== 'https:')) {
  redirect(308, SITE_URL + event.url.pathname + event.url.search, { external: [SITE_URL] });
 }
 const response = await resolve(event);
 if (event.url.hostname.endsWith('.pages.dev')) {
  response.headers.set('X-Robots-Tag', 'noindex');
 }
 return response;
};
