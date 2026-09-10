import { markets } from '@/lib/content/markets';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { MarketPage } from '@/components/public/market-page';

export const metadata = baseGenerateMetadata({
  title: markets.usa.seo.title,
  description: markets.usa.seo.description,
  url: '/usa',
});

export default function USAPage() {
  const market = markets.usa;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiopsmedia.com/' },
      { '@type': 'ListItem', position: 2, name: 'USA' },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: market.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <MarketPage market={market} />
    </>
  );
}
