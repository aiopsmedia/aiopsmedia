import { db } from '@/lib/db';
import { siteConfig } from '@/config';

const baseUrl = siteConfig.url;

export default async function sitemap() {
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/industries`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/usa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/uk`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/uae`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/uae/dubai`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/technology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/estimate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/book-consultation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
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

  // Static service slugs from content (ensures sitemap includes even when DB empty)
  const staticServiceSlugs = ['ai-development','ai-agents','ai-automation','custom-software-development','crm-development','erp-development','real-estate-erp','school-erp','web-development','ecommerce-development','business-process-automation','social-media-management','seo','meta-ads','google-ads'];
  const staticIndustrySlugs = ['real-estate','education','healthcare','ecommerce','hospitality','professional-services','startups','small-business'];
  const staticMarketServiceSlugs = ['ai-development','ai-automation','crm-development','erp-development','software-development'];
  const marketServicePages = [];
  for (const m of ['usa','uk','uae']) {
    for (const s of staticMarketServiceSlugs) {
      marketServicePages.push({ url: `${baseUrl}/${m}/${s}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 });
    }
  }
  const servicePages = staticServiceSlugs.map((slug) => ({ url: `${baseUrl}/services/${slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 }));
  const industryPages = staticIndustrySlugs.map((slug) => ({ url: `${baseUrl}/industries/${slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 }));
  const landingPages = ['usa-ai-development','usa-crm-development','usa-ai-automation','uk-ai-development','uk-crm-development','dubai-ai-development','dubai-crm-development','uae-ai-automation'].map((slug) => ({ url: `${baseUrl}/landing/${slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 }));
  // Blog static slugs
  let blogStaticPages = [];
  try {
    const { blogs } = await import('@/lib/content/blogs');
    blogStaticPages = blogs.map((b) => ({ url: `${baseUrl}/blog/${b.slug}`, lastModified: new Date(b.publishedAt), changeFrequency: 'monthly', priority: 0.6 }));
  } catch {}

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

  return [...staticPages, ...servicePages, ...industryPages, ...marketServicePages, ...landingPages, ...blogStaticPages, ...dynamicPages];
}
