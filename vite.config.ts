import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { preparePhotos } from './scripts/photos.ts';
import { photographyAssets } from './scripts/vite-photos.ts';

export default defineConfig(async () => {
 await preparePhotos();
 return {
	plugins: [
  photographyAssets(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
    routes: { include: ['/*'], exclude: ['/_app/*', '/images/*'] }
   })
		})
	]
 };
});
