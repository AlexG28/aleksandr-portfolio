<script lang="ts">
 import posts from '#lib/content/posts.json';
 import PostList from '#lib/PostList.svelte';
 let query = $state('');
 let filtered = $derived(posts.filter(post => `${post.title} ${post.tag} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase())));
</script>
<svelte:head><title>Blog — Aleksandr Gyumushyan</title><meta name="description" content="Notes on distributed systems, databases, and making code faster. Technical writing by Aleksandr Gyumushyan."/></svelte:head>
<section class="page-intro"><h1>Blog</h1></section>
<section class="blog-archive"><div class="archive-toolbar"><span class="eyebrow" aria-live="polite">{filtered.length.toString().padStart(2,'0')} articles</span><label class="search"><span aria-hidden="true">⌕</span><input type="search" bind:value={query} placeholder="Find an article" aria-label="Search articles"/></label></div>{#if filtered.length}<PostList items={filtered}/>{:else}<div class="empty-state"><h2>No articles found.</h2><p>Try searching for Go, Zig, or distributed systems.</p><button class="pill-link" onclick={() => query = ''}>Clear search ↗</button></div>{/if}</section>
