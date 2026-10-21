<script lang="ts">
 import { onMount } from 'svelte';
 let theme = $state<'light' | 'dark'>('dark');
 let followSystem = true;
 const storageKey = 'color-theme';
 function apply(next: 'light' | 'dark') {
  theme = next;
  document.documentElement.dataset.theme = next;
 }
 function toggle() {
  const next = theme === 'dark' ? 'light' : 'dark';
  followSystem = false;
  apply(next);
  try { localStorage.setItem(storageKey, next); } catch { /* The toggle also works without storage. */ }
 }
 onMount(() => {
  const preference = matchMedia('(prefers-color-scheme: dark)');
  const systemTheme = () => preference.matches ? 'dark' as const : 'light' as const;
  const restore = () => {
   let saved: string | null = null;
   try { saved = localStorage.getItem(storageKey); } catch { /* Use the system preference. */ }
   followSystem = saved !== 'light' && saved !== 'dark';
   apply(saved === 'light' || saved === 'dark' ? saved : systemTheme());
  };
  const onSystemChange = () => { if (followSystem) apply(systemTheme()); };
  const onStorage = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) restore(); };
  restore();
  preference.addEventListener('change', onSystemChange);
  window.addEventListener('storage', onStorage);
  return () => {
   preference.removeEventListener('change', onSystemChange);
   window.removeEventListener('storage', onStorage);
  };
 });
</script>

<svelte:head><meta name="theme-color" content={theme === 'dark' ? '#10110f' : '#f7f8f5'}/></svelte:head>
<button class="theme-toggle" onclick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title={theme === 'dark' ? 'Light theme' : 'Dark theme'}>
 <svg class="theme-icon theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
 <svg class="theme-icon theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>
</button>
