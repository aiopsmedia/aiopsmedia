import Link from 'next/link';
import { ArrowRight, MapPin, Building2, CheckCircle } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata = baseGenerateMetadata({
  title: 'AI & Software Development Company in Dubai | AiOpsMedia',
  description:
    'Serving Dubai businesses remotely from India — AI development, CRM/ERP, automation, real estate tech and business software. No Dubai office claimed.',
  url: '/uae/dubai',
});

export default function DubaiPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiopsmedia.com/' },
      { '@type': 'ListItem', position: 2, name: 'UAE', item: 'https://aiopsmedia.com/uae' },
      { '@type': 'ListItem', position: 3, name: 'Dubai' },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="relative overflow-hidden bg-[#050816] pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#22D3EE]/10 blur-[128px]" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/10 blur-[128px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'UAE', href: '/uae' }, { label: 'Dubai' }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-3 py-1 text-xs font-medium text-[#22D3EE]">
              <MapPin className="h-3.5 w-3.5" /> Serving Dubai businesses remotely from India.
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">AI & Software Development Company in Dubai</h1>
            <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">
              We help Dubai companies build AI agents, CRM systems, Real Estate ERP and automated workflows — delivered remotely with clear communication and staged rollout. We do not claim a Dubai office or registration unless verified.
            </p>
            <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">
              Transparency: AiOpsMedia operates from Kishanganj, Bihar, India and serves Dubai/UAE clients remotely. No physical Dubai office is claimed.
            </div>
            <div className="mt-8 flex gap-4">
              <Link href="/contact?market=dubai" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">
                Discuss Your Dubai Project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/uae" className="inline-flex items-center rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm text-[#F8FAFC]">UAE Overview</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Focused on Dubai&apos;s key sectors</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Real Estate', desc: 'Lead → viewing → booking → commission with WhatsApp concepts', href: '/services/real-estate-erp' },
              { title: 'Hospitality', desc: 'Booking → housekeeping → guest comms → feedback', href: '/industries/hospitality' },
              { title: 'Professional Services', desc: 'CRM → projects → invoicing → reports', href: '/industries/professional-services' },
              { title: 'E-commerce', desc: 'Catalog → payments → inventory → CRM', href: '/services/ecommerce-development' },
              { title: 'AI Agents', desc: 'Support & lead qualification for high enquiry volumes', href: '/services/ai-agents' },
              { title: 'Automation', desc: 'Follow-ups, reminders, reporting — with approvals', href: '/services/ai-automation' },
            ].map((c) => (
              <Link key={c.title} href={c.href} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-6 hover:border-[#22D3EE]/30">
                <h3 className="font-semibold text-[#F8FAFC]">{c.title}</h3>
                <p className="mt-2 text-sm text-[#94A3B8]">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050816] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Why Dubai SMEs choose a remote partner</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-left">
            {['GST-friendly collaboration windows', 'Quick value phases, then scale', 'Code ownership + training, no lock-in'].map((t) => (
              <div key={t} className="flex gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-4 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 text-[#22D3EE] mt-0.5" />{t}</div>
            ))}
          </div>
          <Link href="/estimate" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Get a Dubai Estimate <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
