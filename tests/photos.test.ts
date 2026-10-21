import { test, expect } from 'bun:test';
import sharp from 'sharp';
import { mkdtemp, mkdir, writeFile, readFile, rm, readdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { preparePhotos } from '../scripts/photos';

test('discovers new photos, excludes article assets, preserves originals and corrects orientation', async () => {
 const root = await mkdtemp(join(tmpdir(), 'portfolio-photos-'));
 try {
  const directory = join(root, 'static/images');
  const content = join(root, 'src/lib/content');
  await mkdir(directory, { recursive: true });
  await mkdir(content, { recursive: true });
  await writeFile(join(content, 'photos.json'), '[]');
  await writeFile(join(content, 'post.html'), '<img src="/images/figure.png"/>');
  const input = await sharp({ create: { width: 40, height: 60, channels: 3, background: '#758b9e' } }).jpeg().withMetadata({ orientation: 6 }).toBuffer();
  await writeFile(join(directory, 'new-photo.jpg'), input);
  await writeFile(join(directory, 'avatar.jpg'), input);
  await sharp(input).png().toFile(join(directory, 'figure.png'));
  expect((await preparePhotos(root)).count).toBe(1);
  const [photo] = JSON.parse(await readFile(join(content, 'photos.generated.json'), 'utf8'));
  expect([photo.width, photo.height]).toEqual([60, 40]);
  expect(await readFile(join(directory, 'new-photo.jpg'))).toEqual(input);
  const optimized = join(root, 'static', photo.src);
  expect((await sharp(optimized).metadata()).orientation).toBeUndefined();
  const timestamp = (await stat(optimized)).mtimeMs;
  await preparePhotos(root);
  expect((await stat(optimized)).mtimeMs).toBe(timestamp);
  await rm(join(directory, 'new-photo.jpg'));
  expect((await preparePhotos(root)).count).toBe(0);
  expect(await readdir(join(directory, 'optimized'))).toEqual([]);
 } finally {
  await rm(root, { recursive: true, force: true });
 }
});
