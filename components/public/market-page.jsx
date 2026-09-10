import Link from 'next/link';
import { ArrowRight, CheckCircle, Globe, Building2, Users, Shield, Zap, Clock, Handshake } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { siteConfig } from '@/config';

export function MarketPage({ market }) {
  const m = market;
  return (
    <>
      <section className="relative overflow-hidden bg-[#050816] pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#22D3EE]/10 blur-[128px]" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/10 blur-[128px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: m.short }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-3 py-1 text-xs font-medium text-[#22D3EE]">
              <Globe className="h-3.5 w-3.5" /> Built in India. Serving Businesses Globally.
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">{m.hero.h1}</h1>
            <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">{m.hero.sub}</p>
            <p className="mt-3 text-sm text-[#94A3B8]/80">{m.hero.trust} • No fake offices claimed.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href={m.cta.href} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816] shadow-lg shadow-[#22D3EE]/20 hover:brightness-110">
                {m.cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm font-semibold text-[#F8FAFC] hover:bg-[#111827]">Explore Services</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#F8FAFC]">Business problems we solve in {m.name}</h2>
              <ul className="mt-6 space-y-3">
                {m.painPoints.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 mt-0.5 text-[#22D3EE] shrink-0" />{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#F8FAFC]">How we help</h2>
              <ul className="mt-6 space-y-3">
                {m.solutions.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-[#94A3B8]"><Zap className="h-4 w-4 mt-0.5 text-[#8B5CF6] shrink-0" />{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC]">Services for {m.short}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {m.services.map((s) => (
              <Link key={s.href} href={s.href} className="group rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6 hover:border-[#22D3EE]/30">
                <h3 className="font-semibold text-[#F8FAFC] group-hover:text-[#22D3EE]">{s.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-[#22D3EE]">Learn more <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#F8FAFC] text-center">Remote collaboration that works</h2>
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {m.collaboration.map((c) => (
              <div key={c} className="flex gap-3 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-4 text-sm text-[#94A3B8]">
                <Handshake className="h-4 w-4 mt-0.5 text-[#22D3EE] shrink-0" />{c}
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-xl bg-[#050816] border border-[rgba(148,163,184,0.15)] p-6"><Clock className="mx-auto h-5 w-5 text-[#22D3EE]" /><p className="mt-2 text-sm font-semibold text-[#F8FAFC]">Time-zone overlap</p><p className="text-xs text-[#94A3B8]">Async + live, recorded demos</p></div>
            <div className="rounded-xl bg-[#050816] border border-[rgba(148,163,184,0.15)] p-6"><Shield className="mx-auto h-5 w-5 text-[#8B5CF6]" /><p className="mt-2 text-sm font-semibold text-[#F8FAFC]">Secure delivery</p><p className="text-xs text-[#94A3B8]">Your cloud, your code</p></div>
            <div className="rounded-xl bg-[#050816] border border-[rgba(148,163,184,0.15)] p-6"><Users className="mx-auto h-5 w-5 text-[#22D3EE]" /><p className="mt-2 text-sm font-semibold text-[#F8FAFC]">Maintain & improve</p><p className="text-xs text-[#94A3B8]">Ongoing support sprints</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#F8FAFC] text-center">FAQs — {m.short}</h2>
          <div className="mt-8 space-y-3">
            {m.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5">
                <h3 className="font-semibold text-[#F8FAFC]">{f.q}</h3>
                <p className="mt-2 text-sm text-[#94A3B8]">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Start a Conversation <ArrowRight className="h-4 w-4" /></Link>
            <p className="mt-3 text-xs text-[#94A3B8]">Based in {siteConfig.address} — serving {m.name} remotely.</p>
          </div>
        </div>
      </section>
    </>
  );
}
