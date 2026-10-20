<script lang="ts">
 import posts from '#lib/content/posts.json';
 import photos from '#lib/content/photos.json';
 import PostList from '#lib/PostList.svelte';
</script>
<svelte:head><title>Aleksandr Gyumushyan — Systems, stories & perspectives</title><meta name="description" content="Personal website of Aleksandr Gyumushyan. Exploring distributed systems, performance-sensitive code, and the world through photography."/></svelte:head>
<section class="home-hero">
 <div class="hero-topline"><span class="eyebrow"><span class="status-dot"></span> Aleksandr Gyumushyan</span><span class="eyebrow hero-index">Personal space / 001</span></div>
 <h1>Engineering systems.<br/><span class="muted-heading">Exploring perspectives.</span></h1>
 <div class="hero-bottom"><p>I like building things that work better.<br/>From distributed systems and fast code<br class="desktop-break"/> to a different view through the lens.</p><a class="pill-link" href="/about">A little about me <span>↗</span></a></div>
 <div class="hero-rule"><span>Code with intention. Stay curious.</span><span>Scroll to explore ↓</span></div>
</section>
<section class="section writing-section"><div class="section-heading"><div><span class="eyebrow">01 / The notebook</span><h2>Thinking out loud<span class="accent">.</span></h2></div><a class="text-link" href="/blog">All writing <span>↗</span></a></div><PostList items={posts}/></section>
<section class="section photo-section"><div class="section-heading"><div><span class="eyebrow">02 / Away from the screen</span><h2>A different kind of focus<span class="accent">.</span></h2></div><a class="text-link" href="/photography">View photography <span>↗</span></a></div><div class="home-photos">{#each [photos[8], photos[3], photos[6]] as photo, i}<a href="/photography" class="home-photo"><div class="image-wrap"><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} decoding="async" loading="lazy"/></div><div class="photo-caption"><span>{photo.alt}</span><span>0{i+1} ↗</span></div></a>{/each}</div></section>
<section class="connect-section"><span class="eyebrow">Always curious</span><div><h2>Good things start<br/>with a conversation.</h2><a class="pill-link" href="https://www.linkedin.com/in/aleksandrgyumushyan/">Let’s connect <span>↗</span></a></div></section>
