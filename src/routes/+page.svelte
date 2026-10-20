<script lang="ts">
 import posts from '#lib/content/posts.json';
 import photos from '#lib/content/photos.json';
 import PostList from '#lib/PostList.svelte';
</script>
<svelte:head><title>Aleksandr Gyumushyan</title><meta name="description" content="Aleksandr Gyumushyan’s personal website. About, blog, and photography."/></svelte:head>
<section class="home-hero">
 <h1>Aleksandr<br/><span class="muted-heading">Gyumushyan.</span></h1>
 <div class="hero-bottom"><p>Computer science, systems, and photography.</p><a class="text-link" href="/about">About me ↗</a></div>
</section>
<section class="section writing-section"><div class="section-heading"><h2>Blog</h2><a class="text-link" href="/blog">All posts ↗</a></div><PostList items={posts}/></section>
<section class="section photo-section"><div class="section-heading"><h2>Photography</h2><a class="text-link" href="/photography">All photos ↗</a></div><div class="home-photos">{#each [photos[8], photos[3], photos[6]] as photo}<a href="/photography" class="home-photo" aria-label={'View photography: ' + photo.alt}><div class="image-wrap"><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} decoding="async" loading="lazy"/></div></a>{/each}</div></section>
