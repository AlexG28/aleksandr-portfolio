<script lang="ts">
 import '@fontsource-variable/geist';
 import '@fontsource-variable/geist-mono';
 import '../app.css';
 import { page } from '$app/state';
 import favicon from '#lib/assets/favicon.svg';
 import ThemeToggle from '#lib/ThemeToggle.svelte';
 import { canonicalUrl } from '#lib/site.ts';
 let { children } = $props();
 const links = [['About', '/about'], ['Blog', '/blog'], ['Photography', '/photography']];
</script>
<svelte:head>
 <link rel="icon" href={favicon}/>
 <meta property="og:site_name" content="Aleksandr Gyumushyan"/>
 <link rel="canonical" href={canonicalUrl(page.url.pathname)}/>
 <meta property="og:url" content={canonicalUrl(page.url.pathname)}/>
 <meta property="og:type" content={page.url.pathname.startsWith('/blog/') ? 'article' : 'website'}/>
</svelte:head>
<a class="skip-link" href="#main">Skip to content</a>
<div class="site-shell">
 <header class="site-header">
  <a class="wordmark" href="/" aria-label="Aleksandr Gyumushyan, home">Aleksandr Gyumushyan</a>
  <nav aria-label="Main navigation">
   {#each links as [label, href]}<a {href} aria-current={page.url.pathname.startsWith(href) ? 'page' : undefined}>{label}</a>{/each}
  </nav>
  <div class="header-actions"><a class="header-github" href="https://github.com/AlexG28" target="_blank" rel="noreferrer">GitHub <span>↗</span></a><a class="header-resume" href="/resume/aleksandr_resume.pdf" target="_blank" rel="noopener" type="application/pdf" aria-label="Résumé (PDF, opens in a new tab)">Résumé <span>↗</span></a><ThemeToggle/></div>
 </header>
 <main id="main">{@render children()}</main>
 <footer class="site-footer"><div><a href="/">Aleksandr Gyumushyan<span class="accent">.</span></a></div><div class="footer-links"><a href="https://github.com/AlexG28">GitHub ↗</a><a href="https://www.linkedin.com/in/aleksandrgyumushyan/">LinkedIn ↗</a><a href="/resume/aleksandr_resume.pdf" target="_blank" rel="noopener" type="application/pdf" aria-label="Résumé (PDF, opens in a new tab)">Résumé ↗</a><span>© {new Date().getFullYear()}</span></div></footer>
</div>
