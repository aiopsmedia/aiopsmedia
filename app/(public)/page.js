import Link from 'next/link';
import { db } from '@/lib/db';
import { siteConfig } from '@/config';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { HeroSection } from '@/components/public/hero-section';
import { StatsSection } from '@/components/public/stats-section';
import { ServicesSection } from '@/components/public/services-section';
import { ProcessSection } from '@/components/public/process-section';
import { ProductsSection } from '@/components/public/products-section';
import { WhySection } from '@/components/public/why-section';
import { IndustriesSection } from '@/components/public/industries-section';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import { CaseStudiesSection } from '@/components/public/case-studies-section';
import { FeaturedBlogSection } from '@/components/public/featured-blog-section';
import { FaqSection } from '@/components/public/faq-section';
import { CtaSection } from '@/components/public/cta-section';

export const metadata = baseGenerateMetadata({
  title: 'AI Solutions, Automation & Digital Services for Every Business',
  description:
    'AIOpsMedia democratizes AI for every business. We build AI-powered tools, ERP solutions, custom software, and digital strategies that drive growth.',
  url: '/',
});

async function getSettings() {
  try {
    const settings = await db.siteSetting.findMany({
      where: { group: 'hero' },
    });
    const map = {};
    for (const s of settings) map[s.key] = s.value;
    return map;
  } catch {
    return {};
  }
}

async function getServices() {
  try {
    return await db.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: { title: true, slug: true, icon: true, description: true },
    });
  } catch {
    return [];
  }
}

async function getProducts() {
  try {
    return await db.product.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        price: true,
        originalPrice: true,
        discount: true,
        rating: true,
        reviewCount: true,
        image: true,
        features: true,
      },
    });
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    return await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        clientName: true,
        company: true,
        designation: true,
        content: true,
        rating: true,
      },
    });
  } catch {
    return [];
  }
}

async function getFaqs() {
  try {
    return await db.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: { id: true, question: true, answer: true },
    });
  } catch {
    return [];
  }
}

async function getBlogPosts() {
  try {
    return await db.blog.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        readingTime: true,
        category: { select: { name: true } },
      },
    });
  } catch {
    return [];
  }
}

async function getCaseStudies() {
  try {
    return await db.caseStudy.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        client: true,
        industry: true,
        challenge: true,
        solution: true,
        results: true,
        images: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [settings, services, products, testimonials, faqs, blogPosts, caseStudies] =
    await Promise.all([
      getSettings(),
      getServices(),
      getProducts(),
      getTestimonials(),
      getFaqs(),
      getBlogPosts(),
      getCaseStudies(),
    ]);

  const heroData = {
    heading: settings.hero_heading || undefined,
    subheading: settings.hero_subheading || undefined,
    primaryCta: settings.hero_primary_cta_label
      ? { label: settings.hero_primary_cta_label, href: settings.hero_primary_cta_link || '/contact' }
      : undefined,
    secondaryCta: settings.hero_secondary_cta_label
      ? { label: settings.hero_secondary_cta_label, href: settings.hero_secondary_cta_link || '/services' }
      : undefined,
    trustText: settings.hero_trust_text || undefined,
  };

  const mappedServices = services.map((s) => ({
    icon: null,
    title: s.title,
    description: s.description || '',
    href: `/services/${s.slug}`,
  }));

  const mappedProducts = products.map((p) => ({
    id: p.id,
    name: p.title,
    description: p.shortDescription || '',
    price: p.price ? Number(p.price) : null,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    discount: p.discount,
    rating: p.rating ? Number(p.rating) : null,
    reviews: p.reviewCount,
    image: p.image,
    href: `/products/${p.slug}`,
    demoHref: `/contact?product=${p.slug}`,
    features: p.features ? JSON.parse(p.features) : [],
  }));

  const mappedTestimonials = testimonials.map((t) => ({
    id: t.id,
    quote: t.content,
    name: t.clientName,
    company: t.company || '',
    role: t.designation || '',
    rating: t.rating || 5,
  }));

  const mappedFaqs = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  const mappedBlogPosts = blogPosts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || '',
    coverImage: p.coverImage,
    category: p.category?.name || 'General',
    publishedAt: p.publishedAt?.toISOString() || '',
    readingTime: p.readingTime || 5,
  }));

  const mappedCaseStudies = caseStudies.map((cs) => ({
    id: cs.id,
    title: cs.title,
    slug: cs.slug,
    client: cs.client || '',
    industry: cs.industry || '',
    challenge: cs.challenge || '',
    solution: cs.solution || '',
    results: cs.results ? JSON.parse(cs.results) : [],
    image: cs.images ? JSON.parse(cs.images)[0] : null,
  }));

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.tagline,
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: siteConfig.founder,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kishanganj',
      addressRegion: 'Bihar',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.tagline,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />

      <HeroSection data={heroData} />
      <StatsSection />
      <ServicesSection services={mappedServices} />
      <ProcessSection />
      <ProductsSection products={mappedProducts} />
      <WhySection />
      <IndustriesSection />
      <TestimonialsSection testimonials={mappedTestimonials} />
      <CaseStudiesSection caseStudies={mappedCaseStudies} />
      <FeaturedBlogSection posts={mappedBlogPosts} />
      <FaqSection faqs={mappedFaqs} />
      <CtaSection />
    </>
  );
}
