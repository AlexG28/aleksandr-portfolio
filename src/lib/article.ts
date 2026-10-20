export type ArticleBlock =
 | { type: 'html'; html: string }
 | { type: 'code'; html: string; source: string; language: string; title: string };

function decodeEntities(value: string): string {
 const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
 return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, name: string) => {
  if (name.startsWith('#')) {
   const hexadecimal = name[1].toLowerCase() === 'x';
   const point = Number.parseInt(name.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
   return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  }
  return entities[name.toLowerCase()] ?? entity;
 });
}

// Article HTML is trusted, checked-in content. Separate code so Svelte can render
// accessible controls without injecting interactive markup into the article body.
export function parseArticle(body: string): ArticleBlock[] {
 const blocks: ArticleBlock[] = [];
 const code = /<pre data-code-language="([^"]+)" data-code-title="([^"]*)"><code>([\s\S]*?)<\/code><\/pre>/g;
 let cursor = 0;
 for (const match of body.matchAll(code)) {
  const index = match.index!;
  if (index > cursor) blocks.push({ type: 'html', html: body.slice(cursor, index) });
  blocks.push({
   type: 'code',
   language: decodeEntities(match[1]),
   title: decodeEntities(match[2]),
   html: match[3],
   source: decodeEntities(match[3].replace(/<[^>]*>/g, ''))
  });
  cursor = index + match[0].length;
 }
 if (cursor < body.length) blocks.push({ type: 'html', html: body.slice(cursor) });
 return blocks;
}
