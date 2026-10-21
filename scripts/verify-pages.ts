import { access, readdir, stat, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { strict as assert } from 'node:assert';

const config = JSON.parse(await readFile('wrangler.jsonc', 'utf8'));
const directory: string = config.pages_build_output_dir;
assert(directory, 'Cloudflare Pages output directory is missing');
assert(!config.main && !config.assets, 'Use Pages configuration, not Workers deployment fields');
await access(join(directory, '_worker.js'));
const routes = JSON.parse(await readFile(join(directory, '_routes.json'), 'utf8'));
assert(routes.include.includes('/*'), 'SSR routes must reach the Pages Function');
assert(routes.exclude.includes('/images/*'), 'Images should be served directly by Pages');
let count = 0;
async function inspect(path: string) {
 for (const entry of await readdir(path, { withFileTypes: true })) {
  const file = join(path, entry.name);
  if (entry.isDirectory()) await inspect(file);
  else {
   assert((await stat(file)).size <= 25 * 1024 * 1024, `File exceeds Pages' 25 MiB limit: ${file}`);
   count++;
  }
 }
}
await inspect(directory);
assert(count < 20_000, 'Pages free-plan static file limit exceeded');
const headers = await readFile(join(directory, '_headers'), 'utf8');
assert(headers.includes('/images/optimized/*'), 'Image caching headers are missing');
console.log(`Pages output verified: SSR function, asset routes, caching headers, ${count} files within size limits.`);
