import Link from 'next/link';
import { ArrowRight, FileCheck, ClipboardList, BarChart3, Wrench } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata = baseGenerateMetadata({
  title: 'Resources — Guides & Checklists | AiOpsMedia',
  description: 'Blogs, guides, checklists, CRM/ERP automation ideas and case studies — practical resources for B2B teams.',
  url: '/resources',
});

const resources = [
  { title: 'Blogs & Insights', desc: '20+ articles on AI, CRM, ERP, automation, cost guides.', href: '/blog', icon: FileCheck },
  { title: 'Case Studies', desc: '5 illustrative demos labelled clearly until real permission.', href: '/case-studies', icon: BarChart3 },
  { title: 'AI Automation Checklist', desc: 'Identify, map, prioritise, integrate, approve, measure.', href: '/blog/ai-automation-small-business-start', icon: ClipboardList },
  { title: 'CRM Requirements Checklist', desc: 'Pipeline, roles, reports, integrations, AI scoring.', href: '/services/crm-development', icon: ClipboardList },
  { title: 'Business Process Audit', desc: 'Free discovery call to map your workflows.', href: '/book-consultation', icon: Wrench },
  { title: 'Industry Guides', desc: 'Real Estate, Education, Healthcare, E-commerce & more.', href: '/industries', icon: FileCheck },
];

export default function ResourcesPage() {
  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Resources' }]} />
        <div className="mt-8 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">Resources</h1>
          <p className="mt-4 text-lg text-[#94A3B8]">Practical help — not fluff. Guides and checklists you can use to assess CRM/ERP, automation and AI opportunities.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <Link key={r.title} href={r.href} className="group rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6 hover:border-[#22D3EE]/30">
              <r.icon className="h-6 w-6 text-[#22D3EE]" />
              <h3 className="mt-3 font-semibold text-[#F8FAFC] group-hover:text-[#22D3EE]">{r.title}</h3>
              <p className="mt-1 text-sm text-[#94A3B8]">{r.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-[#22D3EE]">View <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 text-center">
          <h3 className="text-xl font-bold text-[#F8FAFC]">Want a lead magnet?</h3>
          <p className="mt-2 text-sm text-[#94A3B8]">We can gate any resource behind a minimal email capture when you are ready — with consent.</p>
          <Link href="/contact" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Request Checklist <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
