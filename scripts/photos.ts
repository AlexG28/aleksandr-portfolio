import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, mkdir, stat, access, unlink } from 'node:fs/promises';
import { basename, extname, join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const supported = /\.(jpe?g|png|webp|avif|tiff?)$/i;

type PhotoMetadata = { src: string; alt: string };
export type Photo = PhotoMetadata & { original: string; fullSrc: string; srcset: string; width: number; height: number };

export async function preparePhotos(root = projectRoot) {
 const imagesDirectory = join(root, 'static/images');
 const outputDirectory = join(imagesDirectory, 'optimized');
 const metadataPath = join(root, 'src/lib/content/photos.json');
 const manifestPath = join(root, 'src/lib/content/photos.generated.json');
 await mkdir(outputDirectory, { recursive: true });
 const metadata: PhotoMetadata[] = JSON.parse(await readFile(metadataPath, 'utf8'));
 const articleDirectory = join(root, 'src/lib/content');
 const excluded = new Set(['avatar.jpg']);
 for (const name of await readdir(articleDirectory)) {
  if (!name.endsWith('.html')) continue;
  const html = await readFile(join(articleDirectory, name), 'utf8');
  for (const match of html.matchAll(/src="\/images\/([^"/]+)"/g)) excluded.add(match[1]);
 }
 const files = (await readdir(imagesDirectory, { withFileTypes: true }))
  .filter(entry => entry.isFile() && supported.test(entry.name) && !excluded.has(entry.name))
  .map(entry => entry.name);
 const known = new Map(metadata.map(photo => [basename(photo.src), photo]));
 // Preserve the explicit order, then include any photographs dropped into images/.
 const ordered = [...metadata.map(photo => basename(photo.src)).filter(name => files.includes(name)),
  ...files.filter(name => !known.has(name)).sort()];
 const photos: Photo[] = [];
 const active = new Set<string>();
 let sourceBytes = 0;
 let displayBytes = 0;
 for (const name of ordered) {
  const input = await readFile(join(imagesDirectory, name));
  sourceBytes += input.length;
  const image = sharp(input);
  const details = await image.metadata();
  const rotated = (details.orientation ?? 1) >= 5;
  const originalWidth = rotated ? details.height! : details.width!;
  const widths = [...new Set([480, 960, 1600, 2400].map(width => Math.min(width, originalWidth)))].sort((a,b) => a-b);
  const hash = createHash('sha256').update(input).update('webp-v1-q82-rotate').digest('hex').slice(0, 12);
  const variants: { src: string; width: number; height: number }[] = [];
  for (const width of widths) {
   const output = `${hash}-${width}.webp`;
   const path = join(outputDirectory, output);
   active.add(output);
   try { await access(path); }
   catch { await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(path); }
   const info = await sharp(path).metadata();
   variants.push({ src: '/images/optimized/' + output, width: info.width!, height: info.height! });
  }
  const gallery = variants.filter(variant => variant.width <= 960).at(-1)!;
  const full = variants.at(-1)!;
  displayBytes += (await stat(join(root, 'static', full.src))).size;
  photos.push({
   original: '/images/' + name,
   src: gallery.src,
   fullSrc: full.src,
   srcset: variants.map(variant => `${variant.src} ${variant.width}w`).join(', '),
   width: gallery.width,
   height: gallery.height,
   alt: known.get(name)?.alt || `Photograph ${basename(name, extname(name))}`
  });
 }
 const manifest = JSON.stringify(photos, null, 2) + '\n';
 const previous = await readFile(manifestPath, 'utf8').catch(() => '');
 if (previous !== manifest) await writeFile(manifestPath, manifest);
 for (const file of await readdir(outputDirectory)) {
  if (file.endsWith('.webp') && !active.has(file)) await unlink(join(outputDirectory, file));
 }
 return { count: photos.length, originalMB: (sourceBytes / 1024 / 1024).toFixed(1), optimizedMB: (displayBytes / 1024 / 1024).toFixed(1) };
}
