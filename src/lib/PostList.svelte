<script lang="ts">
 import type posts from '#lib/content/posts.json';
 let { items }: { items: typeof posts } = $props();
 const date = (value: string) => new Date(value + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
</script>
<div class="post-list">{#each items as post, i}<a class="post-row" href={'/blog/' + post.slug}><span class="row-number">0{i + 1}</span><div><span class="eyebrow">{post.tag}</span><h3>{post.title}</h3><p>{post.excerpt}</p></div><div class="post-date">{date(post.date)}<span>{post.minutes} min read</span></div><span class="row-arrow">↗</span></a>{/each}</div>
