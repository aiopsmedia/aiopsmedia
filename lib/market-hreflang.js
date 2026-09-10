import { siteConfig } from '@/config';

const base = siteConfig.url.replace(/\/$/, '');

export const hreflangLinks = {
  'en-US': `${base}/usa`,
  'en-GB': `${base}/uk`,
  'en-AE': `${base}/uae`,
  'x-default': base,
};

export function generateHreflangAlternates(path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const mapping = {
    '/': { 'x-default': `${base}/`, 'en-US': `${base}/usa`, 'en-GB': `${base}/uk`, 'en-AE': `${base}/uae` },
    '/usa': { 'en-US': `${base}/usa`, 'en-GB': `${base}/uk`, 'en-AE': `${base}/uae`, 'x-default': base },
    '/uk': { 'en-GB': `${base}/uk`, 'en-US': `${base}/usa`, 'en-AE': `${base}/uae`, 'x-default': base },
    '/uae': { 'en-AE': `${base}/uae`, 'en-US': `${base}/usa`, 'en-GB': `${base}/uk`, 'x-default': base },
  };
  // market service pages: /usa/ai-development etc map to canonical market page
  return mapping[clean] || { 'x-default': `${base}${clean}` };
}

export function generateHreflangLinkTags(path = '/') {
  const alts = generateHreflangAlternates(path);
  return Object.entries(alts).map(([hreflang, href]) => ({ rel: 'alternate', hreflang, href }));
}
