import { siteConfig } from '@/config';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/login', '/api/private/', '/api/health'],
      },
      {
        userAgent: '*',
        allow: ['/', '/services', '/blog', '/usa', '/uk', '/uae', '/industries', '/case-studies'],
        disallow: ['/admin', '/login', '/search?*'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
