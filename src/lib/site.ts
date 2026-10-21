export const SITE_URL = 'https://aleksandrgyumushyan.com';
export const SITE_HOST = new URL(SITE_URL).hostname;

export function canonicalUrl(pathname: string): string {
 const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
 return SITE_URL + path;
}
