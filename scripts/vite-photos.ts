import type { Plugin } from 'vite';
import { resolve, dirname } from 'node:path';
import { preparePhotos } from './photos.ts';

export function photographyAssets(): Plugin {
 return {
  name: 'photography-assets',
  configureServer(server) {
   const directory = resolve('static/images');
   const metadata = resolve('src/lib/content/photos.json');
   let timer: ReturnType<typeof setTimeout>;
   let pending = Promise.resolve();
   const update = (_event: string, path: string) => {
    if (path !== metadata && !(dirname(path) === directory && /\.(jpe?g|png|webp|avif|tiff?)$/i.test(path))) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
     pending = pending.then(async () => {
      await preparePhotos();
      server.ws.send({ type: 'full-reload' });
     }).catch(error => server.config.logger.error(`Photo processing failed: ${error.message}`));
    }, 300);
   };
   server.watcher.add([directory, metadata]);
   server.watcher.on('all', update);
   server.httpServer?.once('close', () => { clearTimeout(timer); server.watcher.off('all', update); });
  }
 };
}
