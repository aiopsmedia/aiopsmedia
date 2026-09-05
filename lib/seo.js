import { APP_NAME, APP_URL } from '@/config/constants';
import { siteConfig } from '@/config';

const baseUrl = APP_URL || 'https://aiopsmedia.com';

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
}) {
  const siteTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} - AI Solutions for Every Business`;
  const metaDescription = description || 'AIOpsMedia democratizes AI for every business. We build AI-powered tools, automations, and digital solutions.';
  const ogImage = image || `${baseUrl}/og-default.png`;
  const canonicalUrl = url ? `${baseUrl}${url}` : baseUrl;

  return {
    title: siteTitle,
    description: metaDescription,
    keywords: ['AI solutions', 'artificial intelligence', 'automation', 'machine learning', 'AIOpsMedia', 'digital transformation'],
    authors: [{ name: APP_NAME }],
    creator: APP_NAME,
    openGraph: {
      title: siteTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: APP_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || APP_NAME,
        },
      ],
      locale: 'en_IN',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: metaDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export function generateProductSchema(product) {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.title,
    description: product.shortDescription || product.description || '',
    url: `${baseUrl}/products/${product.slug}`,
    image: product.image,
    applicationCategory: product.category || 'BusinessApplication',
    offers: product.price
      ? {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: String(product.price),
          availability: product.isActive !== false
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        }
      : undefined,
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: String(product.rating),
          reviewCount: String(product.reviewCount || 1),
        }
      : undefined,
  };
}

export function generateServiceSchema(service) {
  if (!service) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description || '',
    url: `${baseUrl}/services/${service.slug}`,
    provider: {
      '@type': 'Organization',
      name: APP_NAME,
      url: baseUrl,
    },
    serviceType: service.title,
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
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
}

export function generateFAQSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleSchema(article) {
  if (!article) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || '',
    image: article.coverImage,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: article.author?.name || APP_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    url: `${baseUrl}/blog/${article.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${article.slug}`,
    },
  };
}

export function generateCaseStudySchema(caseStudy) {
  if (!caseStudy) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudy.solution || caseStudy.challenge || '',
    url: `${baseUrl}/case-studies/${caseStudy.slug}`,
    datePublished: caseStudy.createdAt,
    dateModified: caseStudy.updatedAt,
    author: {
      '@type': 'Organization',
      name: APP_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/case-studies/${caseStudy.slug}`,
    },
    about: caseStudy.client || caseStudy.industry,
  };
}

export function generateLegalPageSchema(page, url) {
  if (!page) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.seoDescription || page.title,
    url: `${baseUrl}${url}`,
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: APP_NAME,
    description: 'AI solutions, automation, and digital services for businesses',
    url: baseUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressLocality: 'Kishanganj',
      addressRegion: 'Bihar',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.0745,
      longitude: 87.9496,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
    priceRange: '$$',
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };
}
