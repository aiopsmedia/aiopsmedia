import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { industries, getIndustry } from '@/lib/content/industries';

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return baseGenerateMetadata({ title: ind.seoTitle, description: ind.seoDescription, url: `/industries/${slug}` });
}

export default async function IndustryPage({ params }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: ind.seoTitle,
    description: ind.seoDescription,
    url: `https://aiopsmedia.com/industries/${slug}`,
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiopsmedia.com/' },
      { '@type': 'ListItem', position: 2, name: 'Industries', item: 'https://aiopsmedia.com/industries' },
      { '@type': 'ListItem', position: 3, name: ind.title },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <section className="bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries' }, { label: ind.title }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">{ind.title}</h1>
            <p className="mt-4 text-lg text-[#94A3B8]">{ind.seoDescription}</p>
            {ind.disclaimer && <div className="mt-4 flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200"><AlertTriangle className="h-4 w-4" />{ind.disclaimer}</div>}
            <div className="mt-8 flex gap-4">
              <Link href="/book-consultation" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Discuss Your {ind.title} Project <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/case-studies" className="inline-flex items-center rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm text-[#F8FAFC]">View Case Studies</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2">
          <div><h2 className="text-xl font-bold text-[#F8FAFC]">Industry problems</h2><p className="mt-3 text-sm text-[#94A3B8]">{ind.problem}</p></div>
          <div><h2 className="text-xl font-bold text-[#F8FAFC]">Technology solutions</h2><ul className="mt-3 space-y-2">{ind.solutions.map((s) => <li key={s} className="flex gap-2 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 text-[#22D3EE]" />{s}</li>)}</ul></div>
        </div>
      </section>

      <section className="bg-[#050816] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2">
          <div><h3 className="text-lg font-bold text-[#F8FAFC]">AI opportunities</h3><ul className="mt-3 space-y-2">{ind.ai.map((a) => <li key={a} className="text-sm text-[#94A3B8]">• {a}</li>)}</ul></div>
          <div><h3 className="text-lg font-bold text-[#F8FAFC]">Automation opportunities</h3><ul className="mt-3 space-y-2">{ind.automation.map((a) => <li key={a} className="text-sm text-[#94A3B8]">• {a}</li>)}</ul></div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-[#F8FAFC]">CRM / ERP opportunities</h3><p className="mt-2 text-sm text-[#94A3B8]">{ind.crmErp}</p>
          <h3 className="mt-8 text-lg font-bold text-[#F8FAFC]">Example workflow</h3><p className="mt-2 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-4 font-mono text-xs text-[#94A3B8]">{ind.workflow}</p>
          <h3 className="mt-8 text-lg font-bold text-[#F8FAFC]">Implementation process</h3><div className="mt-3 flex flex-wrap gap-2">{ind.process.map((p) => <span key={p} className="rounded-full bg-[#050816] border border-[rgba(148,163,184,0.15)] px-3 py-1 text-xs text-[#94A3B8]">{p}</span>)}</div>
          <div className="mt-10 rounded-2xl bg-[#050816] border border-[rgba(148,163,184,0.15)] p-6 text-center">
            <h4 className="font-bold text-[#F8FAFC]">{ind.cta} — talk to us.</h4>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Get in Touch <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
