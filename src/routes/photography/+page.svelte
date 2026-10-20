<script lang="ts">
 import photos from '#lib/content/photos.json';
 let category = $state('All');
 let filtered = $derived(photos.filter(photo => category === 'All' || photo.category === category));
 let selected = $state(0);
 let dialog: HTMLDialogElement;
 function open(index: number) { selected = index; dialog.showModal(); }
 function step(direction: number) { selected = (selected + direction + filtered.length) % filtered.length; }
</script>
<svelte:head><title>Photography — Aleksandr Gyumushyan</title><meta name="description" content="A collection of photographs by Aleksandr Gyumushyan. Cities, coastlines, night skies, and the moments in between."/></svelte:head>
<section class="page-intro"><span class="eyebrow">03 / Photography</span><h1>A pause.<br/>A different perspective<span class="accent">.</span></h1><p class="intro-copy">Places I’ve been. Moments I wanted to keep.<br/>A little of the world, through my lens.</p></section>
<section class="gallery-section"><div class="archive-toolbar"><div class="filter-tabs" aria-label="Filter photographs">{#each ['All', 'Nature', 'City'] as filter}<button class:active={category === filter} aria-pressed={category === filter} onclick={() => category = filter}>{filter}{#if filter === 'All'}<sup>{photos.length}</sup>{/if}</button>{/each}</div><span class="eyebrow" aria-live="polite">{filtered.length} photographs</span></div><div class="gallery">{#each filtered as photo, i}<button class="gallery-photo" onclick={() => open(i)} aria-label={'Enlarge ' + photo.alt}><div class="image-wrap"><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} decoding="async" loading={i < 2 ? 'eager' : 'lazy'}/><span class="enlarge" aria-hidden="true">↗</span></div><span class="photo-caption"><span>{photo.alt}</span><span>{(i+1).toString().padStart(2,'0')}</span></span></button>{/each}</div></section>
<dialog bind:this={dialog} class="lightbox" onkeydown={(event) => { if(event.key === 'ArrowLeft') step(-1); if(event.key === 'ArrowRight') step(1); }} onclick={(event) => { if (event.target === dialog) dialog.close(); }} aria-label="Photograph viewer">
 <button class="lightbox-close" onclick={() => dialog.close()} aria-label="Close photograph">Close ×</button><div class="lightbox-image"><img src={filtered[selected]?.src} alt={filtered[selected]?.alt}/></div><div class="lightbox-bottom"><span>{filtered[selected]?.alt}</span><div><button onclick={() => step(-1)} aria-label="Previous photograph">←</button><span>{selected+1} / {filtered.length}</span><button onclick={() => step(1)} aria-label="Next photograph">→</button></div></div>
</dialog>
