import Link from 'next/link';
import { ArrowRight, Building2, GraduationCap, HeartPulse, ShoppingBag, Utensils, Briefcase, Rocket, Store } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { industries } from '@/lib/content/industries';

export const metadata = baseGenerateMetadata({
  title: 'Industries We Serve | AiOpsMedia',
  description: 'Real Estate, Education, Healthcare, E-commerce, Hospitality, Professional Services, Startups, Small Business — tailored software & automation.',
  url: '/industries',
});

const icons = { 'real-estate': Building2, education: GraduationCap, healthcare: HeartPulse, ecommerce: ShoppingBag, hospitality: Utensils, 'professional-services': Briefcase, startups: Rocket, 'small-business': Store };

export default function IndustriesPage() {
  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Industries' }]} />
        <div className="mx-auto max-w-3xl text-center mt-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">Industries <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">We Serve</span></h1>
          <p className="mt-6 text-lg text-[#94A3B8]">Every industry has distinct workflows. We build software around yours — CRM/ERP, AI agents and automation that operators actually use.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => {
            const Icon = icons[ind.slug] || Building2;
            return (
              <Link key={ind.slug} href={`/industries/${ind.slug}`} className="group rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6 hover:border-[#22D3EE]/30">
                <div className="mb-4 inline-flex rounded-lg bg-[#22D3EE]/10 p-2.5"><Icon className="h-5 w-5 text-[#22D3EE]" /></div>
                <h2 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#22D3EE]">{ind.title}</h2>
                <p className="mt-2 text-sm text-[#94A3B8]">{ind.short}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-[#22D3EE]">Explore <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            );
          })}
        </div>
        <div className="mt-16 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 text-center">
          <h3 className="text-xl font-bold text-[#F8FAFC]">Your industry not listed?</h3>
          <p className="mt-2 text-sm text-[#94A3B8]">We build custom workflows — if it has forms, approvals, inventory or follow-ups, we can model it.</p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Contact Us <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
