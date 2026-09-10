import Link from 'next/link';
import { ArrowRight, Code2, Brain, Globe, Smartphone, Cloud, Shield, Cpu, BarChart3, Database, Palette, Cog, Zap, Bot, Workflow, Building2, GraduationCap, ShoppingCart, Share2, Search, Megaphone, Target, ContactRound, Boxes } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { services } from '@/lib/content/services';

export const metadata = baseGenerateMetadata({
  title: 'Services — AI, Software & Automation | AiOpsMedia',
  description: 'AI Development, AI Agents, Automation, Custom Software, CRM/ERP, Real Estate & School ERP, Web & E-commerce, Business Automation, SEO, Meta & Google Ads.',
  url: '/services',
});

const iconMap = { Brain, Bot, Workflow, Code2, ContactRound, Boxes, Building2, GraduationCap, Globe, ShoppingCart, Zap, Share2, Search, Megaphone, Target, Cpu, BarChart3, Database, Palette, Cog, Smartphone, Cloud, Shield };

export default async function ServicesPage() {
  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} /></div>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">Our <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Services</span></h1>
          <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">AI + Software + Automation + Business Systems — built around your workflows, not around templates.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <Link key={service.slug} href={`/services/${service.slug}`} className="group relative flex flex-col rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-lg hover:shadow-[#22D3EE]/5">
                <div className="mb-4 inline-flex w-fit rounded-xl bg-[#22D3EE]/10 p-3"><Icon className="h-6 w-6 text-[#22D3EE]" /></div>
                <h2 className="text-lg font-bold text-[#F8FAFC]">{service.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#94A3B8]">{service.short}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#22D3EE] transition-all group-hover:gap-2">Learn More <ArrowRight className="h-4 w-4" /></span>
              </Link>
            );
          })}
        </div>
        <div className="mt-20 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Not sure which service you need?</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#94A3B8]">We will map your workflows and recommend the right architecture — portals, dashboards, CRM/ERP, AI agents or automation.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/book-consultation" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816] shadow-lg shadow-[#22D3EE]/20 hover:brightness-110">Book a Free Consultation <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/estimate" className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm font-semibold text-[#F8FAFC] hover:bg-[#111827]">Get Estimate</Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-[#94A3B8]">
            <Link href="/usa" className="underline hover:text-[#22D3EE]">USA</Link> • <Link href="/uk" className="underline hover:text-[#22D3EE]">UK</Link> • <Link href="/uae" className="underline hover:text-[#22D3EE]">UAE / Dubai</Link> • <Link href="/industries" className="underline hover:text-[#22D3EE]">Industries</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
