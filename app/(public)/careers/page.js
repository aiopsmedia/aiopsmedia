import Link from 'next/link';
import { ArrowRight, Users, Heart, Rocket } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata = baseGenerateMetadata({
  title: 'Careers | AiOpsMedia',
  description: 'Join AiOpsMedia — engineering, design, marketing, operations. No fake vacancies; check back for real openings.',
  url: '/careers',
});

export default function CareersPage() {
  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Careers' }]} />
        <div className="mt-8 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">Careers</h1>
          <p className="mt-4 text-lg text-[#94A3B8]">Build AI, software and automation that businesses run on. We hire for craft, ownership and clear communication.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6"><Users className="h-5 w-5 text-[#22D3EE]" /><h3 className="mt-3 font-semibold text-[#F8FAFC]">Why AiOpsMedia</h3><p className="mt-2 text-sm text-[#94A3B8]">Real problems, small teams, direct client impact, learning budget and code ownership pride.</p></div>
          <div className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6"><Rocket className="h-5 w-5 text-[#8B5CF6]" /><h3 className="mt-3 font-semibold text-[#F8FAFC]">How we work</h3><p className="mt-2 text-sm text-[#94A3B8]">Weekly sprints, async updates, design reviews and staged delivery.</p></div>
          <div className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6"><Heart className="h-5 w-5 text-[#22D3EE]" /><h3 className="mt-3 font-semibold text-[#F8FAFC]">Benefits</h3><p className="mt-2 text-sm text-[#94A3B8]">Flexible hours, remote-friendly, health support where applicable.</p></div>
        </div>
        <div className="mt-12 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 text-center">
          <h3 className="text-xl font-bold text-[#F8FAFC]">Open Positions</h3>
          <p className="mt-2 text-sm text-[#94A3B8]">We&apos;re not currently advertising open positions. Check back soon.</p>
          <p className="mt-1 text-xs text-[#94A3B8]/70">We do not show fake vacancies.</p>
          <Link href="/contact?topic=careers" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Contact Us <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
