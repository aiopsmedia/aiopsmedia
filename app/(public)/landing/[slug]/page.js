import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { getService } from '@/lib/content/services';

const landingMap = {
  'usa-ai-development': { market: 'USA', service: 'ai-development', currency: 'USD', title: 'AI Development for US Businesses — Build Custom AI Around Your Workflows', loc: 'United States' },
  'usa-crm-development': { market: 'USA', service: 'crm-development', currency: 'USD', title: 'Custom CRM for US Businesses — Stop Losing Leads in Spreadsheets', loc: 'United States' },
  'usa-ai-automation': { market: 'USA', service: 'ai-automation', currency: 'USD', title: 'AI Automation for US Businesses — Turn Manual Work Into Flow', loc: 'United States' },
  'uk-ai-development': { market: 'UK', service: 'ai-development', currency: 'GBP', title: 'AI Development for UK Businesses — Custom AI That Fits Your Process', loc: 'United Kingdom' },
  'uk-crm-development': { market: 'UK', service: 'crm-development', currency: 'GBP', title: 'Custom CRM for UK Businesses — Your Pipeline, Your Rules', loc: 'United Kingdom' },
  'dubai-ai-development': { market: 'UAE — Dubai', service: 'ai-development', currency: 'AED', title: 'AI Development for Dubai Businesses — Serve Enquiries Faster', loc: 'Dubai, UAE' },
  'dubai-crm-development': { market: 'UAE — Dubai', service: 'crm-development', currency: 'AED', title: 'Real Estate CRM for Dubai — From Portal Enquiry to Closing', loc: 'Dubai, UAE' },
  'uae-ai-automation': { market: 'UAE', service: 'ai-automation', currency: 'AED', title: 'AI Automation for UAE Businesses — Connect Portal, Site & WhatsApp', loc: 'United Arab Emirates' },
};

export async function generateStaticParams() {
  return Object.keys(landingMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cfg = landingMap[slug];
  if (!cfg) return {};
  const svc = getService(cfg.service);
  return baseGenerateMetadata({
    title: `${svc ? svc.title : cfg.title} | ${cfg.market} | AiOpsMedia`,
    description: `Dedicated landing for ${cfg.market}: ${svc ? svc.short : cfg.title}. No fake offices. Custom estimate in ${cfg.currency} after discovery.`,
    url: `/landing/${slug}`,
  });
}

export default async function LandingPage({ params }) {
  const { slug } = await params;
  const cfg = landingMap[slug];
  if (!cfg) notFound();
  const svc = getService(cfg.service);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiopsmedia.com/' },
      { '@type': 'ListItem', position: 2, name: `Landing — ${cfg.market}` },
    ],
  };
  const serviceSchema = svc ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${svc.title} — ${cfg.market}`,
    provider: { '@type': 'Organization', name: 'AiOpsMedia', url: 'https://aiopsmedia.com' },
    areaServed: cfg.loc,
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {serviceSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />}
      <section className="bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: `Landing — ${cfg.market}`, href: `/landing/${slug}` }]} />
          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-3 py-1 text-xs font-medium text-[#22D3EE]">For {cfg.loc} • {cfg.currency} guidance • No fake offices</span>
            <h1 className="mt-4 text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">{cfg.title}</h1>
            {svc && <p className="mt-4 text-lg text-[#94A3B8]">{svc.problem} {svc.solution}</p>}
            <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">Transparency: Built in India, serving {cfg.loc} remotely. Not claiming a local office.</div>
            <div className="mt-8 flex gap-4">
              <Link href={`/book-consultation?market=${cfg.market.toLowerCase()}`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Book a Free Consultation <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/estimate" className="inline-flex items-center rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm text-[#F8FAFC]">Get Estimate in {cfg.currency}</Link>
            </div>
          </div>
        </div>
      </section>

      {svc && (
        <>
          <section className="bg-[#0B1220] py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-[#F8FAFC]">Pain → Solution</h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-6"><h3 className="font-semibold text-[#F8FAFC]">Pain</h3><p className="mt-2 text-sm text-[#94A3B8]">{svc.problem}</p></div>
                <div className="rounded-xl border border-[#22D3EE]/20 bg-[#050816] p-6"><h3 className="font-semibold text-[#F8FAFC]">Solution</h3><p className="mt-2 text-sm text-[#94A3B8]">{svc.solution}</p></div>
              </div>
              <h3 className="mt-8 font-bold text-[#F8FAFC]">Benefits</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {svc.features.slice(0,6).map((f) => <li key={f} className="flex gap-2 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 text-[#22D3EE]" />{f}</li>)}
              </ul>
            </div>
          </section>

          <section className="bg-[#050816] py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h3 className="font-bold text-[#F8FAFC]">Process</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {svc.process.map((p,i) => <div key={p} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-4 text-center"><span className="text-xs font-bold text-[#22D3EE]">0{i+1}</span><p className="mt-1 text-xs font-semibold text-[#F8FAFC]">{p}</p></div>)}
              </div>
              <div className="mt-8 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6">
                <h4 className="font-semibold text-[#F8FAFC]">FAQs — {cfg.market}</h4>
                <div className="mt-3 space-y-3">
                  {svc.faqs.slice(0,3).map((f) => <div key={f.q}><p className="text-sm font-semibold text-[#F8FAFC]">{f.q}</p><p className="text-xs text-[#94A3B8]">{f.a}</p></div>)}
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-[#94A3B8]"><Shield className="h-4 w-4 text-[#22D3EE]" /> No fake claims. Your code, your data. Audit trail & permissions where needed.</div>
              <div className="mt-6 text-center">
                <Link href={`/contact?market=${cfg.market}&service=${svc.title}`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Start Your Project <ArrowRight className="h-4 w-4" /></Link>
                <p className="mt-2 text-xs text-[#94A3B8]">Prefer <Link href="/estimate" className="text-[#22D3EE]">estimate</Link> or <Link href="/book-consultation" className="text-[#22D3EE]">consultation</Link>?</p>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
