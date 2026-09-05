import { siteConfig } from '@/config';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/login', '/api/private/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
