<script lang="ts">
 import photos from '#lib/content/photos.generated.json';
 let selected = $state(0);
 let viewing = $state(false);
 let dialog: HTMLDialogElement;
 function open(index: number) { selected = index; viewing = true; dialog.showModal(); }
 function step(direction: number) { selected = (selected + direction + photos.length) % photos.length; }
</script>
<svelte:head><title>Photography — Aleksandr Gyumushyan</title><meta name="description" content="Photographs by Aleksandr Gyumushyan."/></svelte:head>
<section class="page-intro"><h1>Photography</h1></section>
<section class="gallery-section"><div class="archive-toolbar"><span class="eyebrow" aria-live="polite">{photos.length} photographs</span></div><div class="gallery">{#each photos as photo, i}<button class="gallery-photo" onclick={() => open(i)} aria-label={'Enlarge ' + photo.alt}><div class="image-wrap"><img src={photo.src} srcset={photo.srcset} sizes="(max-width: 600px) calc(50vw - 30px), (max-width: 900px) 43vw, (max-width: 1440px) 28vw, 410px" alt={photo.alt} width={photo.width} height={photo.height} decoding="async" loading={i < 2 ? 'eager' : 'lazy'}/></div></button>{/each}</div></section>
<dialog bind:this={dialog} onclose={() => viewing = false} class="lightbox" onkeydown={(event) => { if(event.key === 'ArrowLeft') step(-1); if(event.key === 'ArrowRight') step(1); }} onclick={(event) => { if (event.target === dialog) dialog.close(); }} aria-label="Photograph viewer">
 <button class="lightbox-close" onclick={() => dialog.close()} aria-label="Close photograph">Close ×</button><div class="lightbox-image">{#if viewing}<img src={photos[selected]?.fullSrc} alt={photos[selected]?.alt}/>{/if}</div><div class="lightbox-bottom"><div><button onclick={() => step(-1)} aria-label="Previous photograph">←</button><span>{selected+1} / {photos.length}</span><button onclick={() => step(1)} aria-label="Next photograph">→</button></div></div>
</dialog>
