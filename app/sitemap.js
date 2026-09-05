import { db } from '@/lib/db';
import { siteConfig } from '@/config';

const baseUrl = siteConfig.url;

export default async function sitemap() {
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/cookies-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/data-protection`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/accessibility`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  let dynamicPages = [];

  try {
    const [services, products, blogs, caseStudies] = await Promise.all([
      db.service.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { order: 'asc' },
      }),
      db.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { order: 'asc' },
      }),
      db.blog.findMany({
        where: {
          isPublished: true,
          publishedAt: { lte: new Date() },
        },
        select: { slug: true, publishedAt: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
      }),
      db.caseStudy.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    dynamicPages = [
      ...services.map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
      ...products.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
      ...blogs.map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      })),
      ...caseStudies.map((cs) => ({
        url: `${baseUrl}/case-studies/${cs.slug}`,
        lastModified: cs.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      })),
    ];
  } catch {
    // DB may be unavailable during build — return static pages only
  }

  return [...staticPages, ...dynamicPages];
}
