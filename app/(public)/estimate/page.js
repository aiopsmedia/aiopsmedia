import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import EstimateForm from './estimate-form';

export const metadata = baseGenerateMetadata({
  title: 'Get a Project Estimate | AiOpsMedia',
  description: 'Tell us what you are building — website, CRM, ERP, AI agent or automation — and get a custom estimate with scope-based pricing.',
  url: '/estimate',
});

export default function EstimatePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Get a Project Estimate — AiOpsMedia',
    url: 'https://aiopsmedia.com/estimate',
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="bg-[#050816] pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Get Estimate' }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">Get a Project Estimate</h1>
            <p className="mt-4 text-lg text-[#94A3B8]">Answer a few questions — we will review and get back with a responsible estimate. No forced fixed pricing without scope.</p>
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3"><div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6 sm:p-8"><EstimateForm /></div></div>
            <div className="lg:col-span-2">
              <h3 className="font-bold text-[#F8FAFC]">What happens next?</h3>
              <ol className="mt-3 list-decimal pl-5 text-sm text-[#94A3B8] space-y-2">
                <li>We review your brief within 1 business day.</li>
                <li>15-min clarification call if needed.</li>
                <li>Custom proposal with options: fixed scope or T&M.</li>
              </ol>
              <div className="mt-6 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-4 text-xs text-[#94A3B8]">Your data is not shared. India pricing vs international custom pricing clearly separated — see <Link href="/pricing" className="text-[#22D3EE]">Pricing</Link>.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
