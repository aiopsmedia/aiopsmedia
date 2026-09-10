import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { getService } from '@/lib/content/services';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const allowed = ['ai-development','ai-automation','crm-development','erp-development','software-development'];

export async function generateStaticParams() { return allowed.map((s) => ({ service: s })); }

export async function generateMetadata({ params }) {
  const { service } = await params;
  const svc = getService(service === 'software-development' ? 'custom-software-development' : service);
  if (!svc) return {};
  return baseGenerateMetadata({
    title: `${svc.title} for UK Businesses | AiOpsMedia`,
    description: `${svc.short} For UK businesses — British English, GBP guidance, GDPR-aware.`,
    url: `/uk/${service}`,
  });
}

export default async function UKServicePage({ params }) {
  const { service } = await params;
  if (!allowed.includes(service)) return <div className="pt-32 pb-20 text-center text-[#94A3B8]">Service not available — <Link href="/uk" className="text-[#22D3EE]">UK overview</Link>.</div>;
  const svc = getService(service === 'software-development' ? 'custom-software-development' : service);
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiopsmedia.com/' },
      { '@type': 'ListItem', position: 2, name: 'UK', item: 'https://aiopsmedia.com/uk' },
      { '@type': 'ListItem', position: 3, name: svc.title },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'UK', href: '/uk' }, { label: svc.title }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">{svc.title} for UK Businesses</h1>
            <p className="mt-4 text-lg text-[#94A3B8]">{svc.hero} — Tailored for UK SMEs with British spelling, GBP pricing guidance and UK tooling.</p>
            <p className="mt-3 text-sm text-[#94A3B8]/80">No UK office claimed. GMT/BST overlap and clear updates.</p>
            <div className="mt-8 flex gap-4">
              <Link href="/book-consultation?market=uk" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Book a UK Consultation <ArrowRight className="h-4 w-4" /></Link>
              <Link href={`/services/${svc.slug}`} className="inline-flex items-center rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm text-[#F8FAFC]">Global Service</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#0B1220] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-[#F8FAFC]">Why UK teams choose this</h2>
          <p className="mt-2 text-sm text-[#94A3B8]">{svc.solution}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {svc.features.map((f) => <li key={f} className="flex gap-2 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 text-[#22D3EE]" />{f}</li>)}
          </ul>
          <p className="mt-6 text-sm text-[#94A3B8]">Illustrative GBP ranges quoted after discovery; no fixed price without scope.</p>
        </div>
      </section>
      <section className="bg-[#050816] py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[#F8FAFC]">Related</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {svc.related.map((slug) => { const r = getService(slug); if(!r) return null; return <Link key={slug} href={`/services/${slug}`} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-4"><h4 className="font-semibold text-[#F8FAFC]">{r.title}</h4></Link>; })}
          </div>
        </div>
      </section>
    </>
  );
}
