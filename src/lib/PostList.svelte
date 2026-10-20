<script lang="ts">
 import type posts from '#lib/content/posts.json';
 let { items }: { items: typeof posts } = $props();
 const date = (value: string) => new Date(value + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
</script>
<div class="post-list">
 {#each items as post}
  <a class="post-row" href={'/blog/' + post.slug}>
   <h3>{post.title}</h3>
   <time class="post-date" datetime={post.date}>{date(post.date)}</time>
  </a>
 {/each}
</div>
