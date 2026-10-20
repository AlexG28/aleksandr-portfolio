import { describe, expect, test } from 'bun:test';
import { parseArticle } from '../src/lib/article';

describe('article code blocks', () => {
 test('keeps prose around code in order and preserves highlighting', () => {
  const blocks = parseArticle('<p>Before</p><pre data-code-language="go" data-code-title="Example"><code><span class="syntax-keyword">return</span> nil\n</code></pre><p>After</p>');
  expect(blocks).toEqual([
   { type: 'html', html: '<p>Before</p>' },
   { type: 'code', language: 'go', title: 'Example', html: '<span class="syntax-keyword">return</span> nil\n', source: 'return nil\n' },
   { type: 'html', html: '<p>After</p>' }
  ]);
 });
 test('copies operators, indentation, and entities without double decoding', () => {
  const [block] = parseArticle('<pre data-code-language="text" data-code-title="A &amp; B"><code>\tif (a &lt; b &amp;&amp; b &gt; 0)\n\t&quot;&amp;lt;&#39;&#x21;&quot;\n</code></pre>');
  expect(block).toMatchObject({ title: 'A & B', source: '\tif (a < b && b > 0)\n\t"&lt;\'!"\n' });
 });
 test('supports multiple examples and articles without code', () => {
  const snippet = '<pre data-code-language="bash" data-code-title=""><code>go test\n</code></pre>';
  expect(parseArticle(snippet + snippet).filter(block => block.type === 'code')).toHaveLength(2);
  expect(parseArticle('<p>No code</p>')).toEqual([{ type: 'html', html: '<p>No code</p>' }]);
 });
});
