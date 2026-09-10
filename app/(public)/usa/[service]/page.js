import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { markets } from '@/lib/content/markets';
import { services, getService } from '@/lib/content/services';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const allowed = ['ai-development','ai-automation','crm-development','erp-development','software-development'];

export async function generateStaticParams() {
  return allowed.map((s) => ({ service: s }));
}

export async function generateMetadata({ params }) {
  const { service } = await params;
  const svc = getService(service === 'software-development' ? 'custom-software-development' : service);
  if (!svc) return {};
  return baseGenerateMetadata({
    title: `${svc.title} for US Businesses | AiOpsMedia`,
    description: `Custom ${svc.title.toLowerCase()} for US businesses — ${svc.short} Delivered remotely from India with US-friendly collaboration.`,
    url: `/usa/${service}`,
  });
}

export default async function USAServicePage({ params }) {
  const { service } = await params;
  if (!allowed.includes(service)) {
    return <div className="pt-32 pb-20 text-center text-[#94A3B8]">Service not available for USA — explore <Link href="/usa" className="text-[#22D3EE]">USA overview</Link>.</div>;
  }
  const svc = getService(service === 'software-development' ? 'custom-software-development' : service);
  const market = markets.usa;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiopsmedia.com/' },
      { '@type': 'ListItem', position: 2, name: 'USA', item: 'https://aiopsmedia.com/usa' },
      { '@type': 'ListItem', position: 3, name: svc.title },
    ],
  };
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${svc.title} for US Businesses`,
    provider: { '@type': 'Organization', name: 'AiOpsMedia', url: 'https://aiopsmedia.com' },
    areaServed: { '@type': 'Country', name: 'United States' },
    url: `https://aiopsmedia.com/usa/${service}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <section className="bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'USA', href: '/usa' }, { label: svc.title }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">{svc.title} for US Businesses</h1>
            <p className="mt-4 text-lg text-[#94A3B8]">{svc.hero} — Tailored for US workflows, compliance expectations and time-zones. Serving remotely from India.</p>
            <p className="mt-3 text-sm text-[#94A3B8]/80">Transparent: No US office claimed. US-friendly overlap and clear async updates.</p>
            <div className="mt-8 flex gap-4">
              <Link href="/book-consultation?market=usa" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Book a US Consultation <ArrowRight className="h-4 w-4" /></Link>
              <Link href={`/services/${svc.slug}`} className="inline-flex items-center rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm text-[#F8FAFC]">Global Service</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">Business problem</h2>
            <p className="mt-3 text-sm text-[#94A3B8]">{svc.problem} For US SMEs and mid-market teams, this shows up as missed SLA and operator overload.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">Our solution for the USA</h2>
            <p className="mt-3 text-sm text-[#94A3B8]">{svc.solution} Adapted to US tools (Stripe, HubSpot, Salesforce concepts) and US English.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#050816] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-[#F8FAFC]">Features that matter for US clients</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {svc.features.map((f) => <li key={f} className="flex gap-2 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 text-[#22D3EE]" />{f}</li>)}
          </ul>
          <h3 className="mt-8 text-lg font-bold text-[#F8FAFC]">Industries served</h3>
          <p className="mt-2 text-sm text-[#94A3B8]">{svc.industries.join(' • ')}</p>
          <h3 className="mt-8 text-lg font-bold text-[#F8FAFC]">Process for US delivery</h3>
          <p className="mt-2 text-sm text-[#94A3B8]">Discover → Strategize → Build → Test → Launch → Improve — with overlap for EST/PST and Loom demos.</p>
          <div className="mt-6">
            <Link href="/estimate?market=usa" className="inline-flex items-center gap-2 text-sm font-semibold text-[#22D3EE]">Get a US-tailored estimate — {market.currency} guidance <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[#F8FAFC]">Related services</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {svc.related.map((slug) => {
              const r = getService(slug);
              if (!r) return null;
              return <Link key={slug} href={`/services/${slug}`} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-4 hover:border-[#22D3EE]/30"><h4 className="font-semibold text-[#F8FAFC]">{r.title}</h4><p className="mt-1 text-xs text-[#94A3B8]">{r.short}</p></Link>;
            })}
          </div>
          <h3 className="mt-8 text-lg font-bold text-[#F8FAFC]">FAQs for USA</h3>
          <div className="mt-4 space-y-3">
            {svc.faqs.map((f) => <div key={f.q} className="rounded-xl bg-[#050816] border border-[rgba(148,163,184,0.15)] p-4"><p className="font-semibold text-[#F8FAFC]">{f.q}</p><p className="text-sm text-[#94A3B8]">{f.a}</p></div>)}
          </div>
        </div>
      </section>
    </>
  );
}
