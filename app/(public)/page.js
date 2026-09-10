import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Brain, Bot, ContactRound, Boxes, Code2, Zap, Building2, GraduationCap, HeartPulse, ShoppingBag, Utensils, Briefcase, Rocket, Store, CheckCircle, Sparkles } from 'lucide-react';
import { db } from '@/lib/db';
import { siteConfig } from '@/config';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { globalFaqs } from '@/lib/content/faqs';
import { blogs as staticBlogs } from '@/lib/content/blogs';
import { caseStudies as staticCases } from '@/lib/content/case-studies';

export const metadata = baseGenerateMetadata({
  title: 'AI, Software & Automation Built Around Your Business | AiOpsMedia',
  description:
    'AiOpsMedia helps businesses design and build intelligent software, AI agents, CRM systems, ERP platforms and automated workflows that reduce manual work and create scalable digital operations. Serving USA, UK, UAE worldwide.',
  url: '/',
});

async function getBlogPosts() {
  try {
    const posts = await db.blog.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' }, take: 3, select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true, readingTime: true, category: { select: { name: true } } } });
    if (posts.length > 0) return posts.map((p) => ({ title: p.title, slug: p.slug, excerpt: p.excerpt || '', category: p.category?.name || 'Insights', date: p.publishedAt?.toISOString() || '', readingTime: p.readingTime || 5 }));
  } catch {}
  return staticBlogs.slice(0,3).map((b) => ({ title: b.title, slug: b.slug, excerpt: b.description, category: b.category, date: b.publishedAt, readingTime: b.readingTime }));
}

async function getCaseStudiesForHome() {
  try {
    const cases = await db.caseStudy.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 3 });
    if (cases.length > 0) return cases.map((c) => ({ title: c.title, slug: c.slug, industry: c.industry || '', summary: c.challenge || c.solution || '', status: 'real' }));
  } catch {}
  return staticCases.slice(0,3).map((c) => ({ title: c.title, slug: c.slug, industry: c.industry, summary: c.summary, status: 'illustrative' }));
}

export default async function HomePage() {
  const blogPosts = await getBlogPosts();
  const caseStudies = await getCaseStudiesForHome();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.tagline,
    foundingDate: '2024',
    founder: { '@type': 'Person', name: siteConfig.founder },
    address: { '@type': 'PostalAddress', addressLocality: 'Kishanganj', addressRegion: 'Bihar', addressCountry: 'IN' },
    contactPoint: { '@type': 'ContactPoint', telephone: siteConfig.phone, email: siteConfig.email, contactType: 'customer service', availableLanguage: ['English', 'Hindi'] },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.tagline,
    potentialAction: { '@type': 'SearchAction', target: `${siteConfig.url}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: globalFaqs.slice(0,10).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#22D3EE]/10 blur-[128px]" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#8B5CF6]/10 blur-[128px]" />
          <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22D3EE]/5 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
                <span className="text-xs font-medium text-[#22D3EE]">AI + Software + Automation + Business Systems</span>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-[3.2rem]">
                <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">AI, Software & Automation</span> Built Around Your Business
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#94A3B8] lg:mx-0">
                AiOpsMedia helps businesses design and build intelligent software, AI agents, CRM systems, ERP platforms and automated workflows that reduce manual work and create scalable digital operations.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link href="/book-consultation" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816] shadow-lg shadow-[#22D3EE]/20 hover:brightness-110">Book a Free Consultation <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/services" className="inline-flex items-center rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm font-semibold text-[#F8FAFC] hover:bg-[#111827]">Explore Our Services</Link>
              </div>
              <p className="mt-6 text-xs font-medium uppercase tracking-widest text-[#94A3B8]">Serving businesses across the USA, UK, UAE and worldwide.</p>
              <p className="mt-2 text-xs text-[#94A3B8]/70">Built in India. Serving Businesses Globally. • No fake offices claimed.</p>
            </div>
            <div className="relative mx-auto w-full max-w-lg lg:mx-0">
              <div className="relative overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.15)] shadow-2xl shadow-[#22D3EE]/10">
                <Image src="/hero-image.png" alt="CRM ERP AI Agent Automation Analytics Integrations visual" width={1024} height={768} priority className="h-auto w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/60 via-transparent to-transparent" />
              </div>
              {/* Abstract system visual overlay */}
              <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220]/95 p-4 shadow-xl backdrop-blur sm:flex gap-2">
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <span className="rounded bg-[#22D3EE]/10 px-2 py-1 text-[#22D3EE]">CRM</span>
                  <span className="rounded bg-[#8B5CF6]/10 px-2 py-1 text-[#8B5CF6]">ERP</span>
                  <span className="rounded bg-emerald-500/10 px-2 py-1 text-emerald-400">AI Agent</span>
                  <span className="rounded bg-amber-500/10 px-2 py-1 text-amber-400">Automation</span>
                  <span className="rounded bg-cyan-500/10 px-2 py-1 text-cyan-400">Analytics</span>
                  <span className="rounded bg-violet-500/10 px-2 py-1 text-violet-400">Integrations</span>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 hidden items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220]/95 p-3 shadow-xl backdrop-blur sm:flex">
                <Brain className="h-5 w-5 text-[#22D3EE]" /><p className="text-sm font-medium text-[#F8FAFC]">Connected operations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Technology That Solves Real Business Problems */}
      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC] sm:text-4xl">Technology That Solves <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Real Business Problems</span></h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Brain, title: 'AI Development', desc: 'Custom AI systems designed around your workflows.' , href: '/services/ai-development'},
              { icon: Bot, title: 'AI Agents', desc: 'AI-powered agents for support, sales, operations and internal processes.', href: '/services/ai-agents'},
              { icon: ContactRound, title: 'CRM Development', desc: 'Custom CRM platforms designed around your sales process.', href: '/services/crm-development'},
              { icon: Boxes, title: 'ERP Development', desc: 'Integrated systems for finance, operations, inventory and business management.', href: '/services/erp-development'},
              { icon: Code2, title: 'Custom Software', desc: 'Purpose-built software for unique business requirements.', href: '/services/custom-software-development'},
              { icon: Zap, title: 'Automation', desc: 'Connect systems and automate repetitive business processes.', href: '/services/ai-automation'},
            ].map((c) => (
              <Link key={c.title} href={c.href} className="group rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-6 hover:border-[#22D3EE]/30">
                <div className="mb-4 inline-flex rounded-lg bg-[#22D3EE]/10 p-2.5"><c.icon className="h-5 w-5 text-[#22D3EE]" /></div>
                <h3 className="font-semibold text-[#F8FAFC] group-hover:text-[#22D3EE]">{c.title}</h3>
                <p className="mt-2 text-sm text-[#94A3B8]">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Built for Businesses That Want More Than a Website */}
      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">Built for Businesses That Want <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">More Than a Website</span></h2>
            <p className="mt-4 text-[#94A3B8]">AiOpsMedia does not only build websites. We build business systems.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            {['customer portals','dashboards','CRM systems','ERP platforms','AI agents','internal tools','automation workflows','SaaS products','mobile-ready business systems','integrations'].map((it) => (
              <div key={it} className="flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-4 py-3 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 text-[#22D3EE]" />{it}</div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">See What We Build <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* SECTION 4 — International Markets */}
      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC]">Serving Businesses Worldwide</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-8">
              <h3 className="text-xl font-bold text-[#F8FAFC]">USA</h3>
              <p className="mt-2 text-sm text-[#94A3B8]">AI and software development for American businesses.</p>
              <Link href="/usa" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#22D3EE]">Explore USA Solutions <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-8">
              <h3 className="text-xl font-bold text-[#F8FAFC]">UK</h3>
              <p className="mt-2 text-sm text-[#94A3B8]">AI, automation and custom software solutions for UK businesses.</p>
              <Link href="/uk" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#22D3EE]">Explore UK Solutions <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-8">
              <h3 className="text-xl font-bold text-[#F8FAFC]">UAE</h3>
              <p className="mt-2 text-sm text-[#94A3B8]">AI, software and business automation for Dubai and UAE businesses.</p>
              <Link href="/uae" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#22D3EE]">Explore UAE Solutions <ArrowRight className="h-4 w-4" /></Link>
              <div className="mt-4 text-xs text-[#94A3B8]/70">Also: <Link href="/uae/dubai" className="text-[#22D3EE]">Dubai</Link> • Abu Dhabi • Sharjah</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Industries */}
      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC]">Industries We Serve</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: 'Real Estate', href: '/industries/real-estate', icon: Building2 },
              { label: 'Education', href: '/industries/education', icon: GraduationCap },
              { label: 'Healthcare', href: '/industries/healthcare', icon: HeartPulse },
              { label: 'Professional Services', href: '/industries/professional-services', icon: Briefcase },
              { label: 'E-commerce', href: '/industries/ecommerce', icon: ShoppingBag },
              { label: 'Retail', href: '/industries/small-business', icon: Store },
              { label: 'Hospitality', href: '/industries/hospitality', icon: Utensils },
              { label: 'Startups', href: '/industries/startups', icon: Rocket },
              { label: 'SMEs', href: '/industries/small-business', icon: Store },
              { label: 'Agencies', href: '/industries/professional-services', icon: Briefcase },
            ].map((it) => (
              <Link key={it.label} href={it.href} className="group rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5 text-center hover:border-[#22D3EE]/30">
                <it.icon className="mx-auto h-6 w-6 text-[#22D3EE]" />
                <p className="mt-3 text-sm font-semibold text-[#F8FAFC] group-hover:text-[#22D3EE]">{it.label}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center"><Link href="/industries" className="text-sm text-[#22D3EE] hover:underline">View all industries →</Link></div>
        </div>
      </section>

      {/* SECTION 6 — Process */}
      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC]">How We Work</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: '01', t: 'Discover', d: 'Understand the business, workflows, goals and pain points.' },
              { n: '02', t: 'Strategize', d: 'Design the right technology architecture and product strategy.' },
              { n: '03', t: 'Build', d: 'Develop the software, AI systems and integrations.' },
              { n: '04', t: 'Test', d: 'Validate functionality, performance, security and usability.' },
              { n: '05', t: 'Launch', d: 'Deploy the solution and prepare it for real users.' },
              { n: '06', t: 'Improve', d: 'Continue optimization, automation and feature development.' },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-6">
                <span className="text-xs font-bold tracking-widest text-[#22D3EE]">{s.n}</span>
                <h3 className="mt-2 font-bold text-[#F8FAFC]">{s.t}</h3>
                <p className="mt-1 text-sm text-[#94A3B8]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — Featured Case Studies */}
      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-[#F8FAFC]">Featured Case Studies</h2>
            <Link href="/case-studies" className="hidden text-sm text-[#22D3EE] hover:underline sm:inline">View all →</Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="group overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] hover:border-[#22D3EE]/30">
                <div className="h-40 bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10 flex items-center justify-center"><span className="text-xs text-[#94A3B8]/40">{cs.industry}</span></div>
                <div className="p-5">
                  {cs.status === 'illustrative' && <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">Illustrative Case Study</span>}
                  <h3 className="mt-1 font-semibold text-[#F8FAFC] group-hover:text-[#22D3EE] line-clamp-2">{cs.title}</h3>
                  <p className="mt-1 text-xs text-[#94A3B8] line-clamp-2">{cs.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — Insights */}
      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-[#F8FAFC]">Insights</h2>
            <Link href="/blog" className="hidden text-sm text-[#22D3EE] hover:underline sm:inline">View all →</Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] hover:border-[#22D3EE]/30">
                <div className="h-40 bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10 flex items-center justify-center"><span className="text-xs text-[#94A3B8]/40">{post.category}</span></div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8]"><span>{post.category}</span> • <span>{post.readingTime} min</span></div>
                  <h3 className="mt-2 font-semibold text-[#F8FAFC] group-hover:text-[#22D3EE] line-clamp-2">{post.title}</h3>
                  <p className="mt-1 text-xs text-[#94A3B8] line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — FAQ */}
      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC]">FAQs</h2>
          <div className="mt-10 space-y-3">
            {globalFaqs.slice(0,10).map((f) => (
              <div key={f.q} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5">
                <h3 className="font-semibold text-[#F8FAFC]">{f.q}</h3>
                <p className="mt-2 text-sm text-[#94A3B8]">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — Final CTA */}
      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">Have a Business Problem You Want to Automate?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#94A3B8]">Tell us what you are trying to build, improve or automate. We will help you identify the right technology approach.</p>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816] shadow-lg shadow-[#22D3EE]/20 hover:brightness-110">Start a Conversation <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
