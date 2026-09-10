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
    title: `${svc.title} for UAE Businesses | AiOpsMedia`,
    description: `${svc.short} For Dubai & UAE — real estate, hospitality, e-commerce focus. Delivered remotely from India.`,
    url: `/uae/${service}`,
  });
}

export default async function UAEServicePage({ params }) {
  const { service } = await params;
  if (!allowed.includes(service)) return <div className="pt-32 pb-20 text-center text-[#94A3B8]">Service not available — <Link href="/uae" className="text-[#22D3EE]">UAE overview</Link>.</div>;
  const svc = getService(service === 'software-development' ? 'custom-software-development' : service);
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiopsmedia.com/' },
      { '@type': 'ListItem', position: 2, name: 'UAE', item: 'https://aiopsmedia.com/uae' },
      { '@type': 'ListItem', position: 3, name: svc.title },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'UAE', href: '/uae' }, { label: svc.title }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">{svc.title} for UAE Businesses</h1>
            <p className="mt-4 text-lg text-[#94A3B8]">{svc.hero} — Focused on Dubai/Abu Dhabi/Sharjah: real estate, hospitality, professional services and e-commerce.</p>
            <p className="mt-3 text-sm text-[#94A3B8]/80">Serving UAE remotely from India. No UAE office claimed. GST overlap, Arabic/English support.</p>
            <div className="mt-8 flex gap-4">
              <Link href="/book-consultation?market=uae" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Book a UAE Consultation <ArrowRight className="h-4 w-4" /></Link>
              <Link href={`/services/${svc.slug}`} className="inline-flex items-center rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm text-[#F8FAFC]">Global Service</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#0B1220] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-[#F8FAFC]">Why UAE teams choose this</h2>
          <p className="mt-2 text-sm text-[#94A3B8]">{svc.solution}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {svc.features.map((f) => <li key={f} className="flex gap-2 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 text-[#22D3EE]" />{f}</li>)}
          </ul>
          <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">UAE quote in AED after discovery. Real Estate integrations via compliant adapters (Bayut/Property Finder concepts).</div>
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
