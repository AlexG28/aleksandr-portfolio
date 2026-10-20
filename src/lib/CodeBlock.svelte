<script lang="ts">
 import { onDestroy } from 'svelte';
 let { html, source, language, title }: { html: string; source: string; language: string; title: string } = $props();
 let expanded = $state(false);
 let copyStatus = $state('Copy');
 let timer: ReturnType<typeof setTimeout>;
 const labels: Record<string, string> = { go: 'Go', zig: 'Zig', bash: 'Shell', text: 'Text' };
 let lines = $derived(source.replace(/\n$/, '').split('\n').length);
 let long = $derived(lines > 18);
 async function copy() {
  clearTimeout(timer);
  try {
   await navigator.clipboard.writeText(source);
   copyStatus = 'Copied';
  } catch {
   copyStatus = 'Copy failed';
  }
  timer = setTimeout(() => copyStatus = 'Copy', 2000);
 }
 onDestroy(() => clearTimeout(timer));
</script>

<div class="code-viewer">
 <div class="code-toolbar">
  <div class="code-label"><span>{labels[language] ?? language}</span>{#if title}<span class="code-title">{title}</span>{/if}</div>
  <div class="code-controls">
   {#if long}<button onclick={() => expanded = !expanded} aria-expanded={expanded}>{expanded ? 'Collapse' : 'Expand'}</button>{/if}
   <button onclick={copy} aria-label="Copy code"><span aria-live="polite">{copyStatus}</span></button>
  </div>
 </div>
 <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to focus the region to scroll code.) -->
 <div class="code-scroll" class:bounded={long && !expanded} tabindex="0" role="region" aria-label={title || `${labels[language] ?? language} code example`}>
  <div class="code-grid">
   <div class="code-line-numbers" aria-hidden="true">{#each Array(lines) as _, i}<span>{i + 1}</span>{/each}</div>
   <pre><code>{@html html}</code></pre>
  </div>
 </div>
</div>
