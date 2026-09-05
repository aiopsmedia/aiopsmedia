import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const defaultData = {
  heading: 'Build Smarter. Automate Faster. Grow with AI.',
  subheading:
    'AIOpsMedia helps businesses build intelligent software, automate operations, manage customers and accelerate digital growth.',
  primaryCta: { label: 'Start a Project', href: '/contact' },
  secondaryCta: { label: 'Explore Services', href: '/services' },
  trustText: 'Trusted by 50+ Businesses',
  stats: [
    { value: '50+', label: 'Projects' },
    { value: '30+', label: 'Happy Clients' },
    { value: '5+', label: 'Years' },
    { value: '99%', label: 'Satisfaction' },
  ],
};

function HeroSection({ data }) {
  const clean = data
    ? Object.fromEntries(Object.entries(data).filter(([, v]) => v !== null && v !== undefined))
    : {};
  const d = { ...defaultData, ...clean };

  return (
    <section className="relative overflow-hidden bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28" aria-label="Hero">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#22D3EE]/10 blur-[128px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#8B5CF6]/10 blur-[128px]" />
        <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22D3EE]/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050816_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
              <span className="text-xs font-medium text-[#22D3EE]">AI-Powered Digital Solutions</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-[3.4rem]">
              {d.heading.split('AI').map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}
                    <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">AI</span>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#94A3B8] sm:text-xl lg:mx-0">
              {d.subheading}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button asChild size="lg">
                <Link href={d.primaryCta.href}>
                  {d.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={d.secondaryCta.href}>{d.secondaryCta.label}</Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex -space-x-2">
                {['from-cyan-400 to-blue-500', 'from-violet-400 to-purple-500', 'from-fuchsia-400 to-pink-500', 'from-emerald-400 to-teal-500'].map((g) => (
                  <span key={g} className={`h-8 w-8 rounded-full border-2 border-[#050816] bg-gradient-to-br ${g}`} />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="text-xs text-[#94A3B8]">
                  <span className="font-medium text-[#F8FAFC]">50+ businesses</span> trust AIOpsMedia
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0">
            <div className="relative overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.15)] shadow-2xl shadow-[#22D3EE]/10">
              <Image
                src="/hero-image.png"
                alt="AIOpsMedia AI-powered solutions dashboard"
                width={1024}
                height={768}
                priority
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/60 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220]/95 p-4 shadow-xl backdrop-blur sm:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Users className="h-5 w-5 text-emerald-400" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#F8FAFC]">AI Automation</p>
                <p className="text-xs text-[#94A3B8]">Processes scaled 10x</p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 hidden items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220]/95 p-3 shadow-xl backdrop-blur sm:flex">
              <Sparkles className="h-5 w-5 text-[#22D3EE]" />
              <p className="text-sm font-medium text-[#F8FAFC]">Groq-powered RAG</p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-[rgba(148,163,184,0.15)] pt-10">
          <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-[#94A3B8]">
            {d.trustText}
          </p>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {d.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-[#94A3B8]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroSection };