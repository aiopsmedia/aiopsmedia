import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { generateMetadata as baseGenerateMetadata, generateServiceSchema, generateFAQSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { CtaSection } from '@/components/public/cta-section';
import { services as staticServices, getService as getStaticService } from '@/lib/content/services';

const fallbackServices = {
  'ai-automation': {
    title: 'AI & Automation',
    slug: 'ai-automation',
    description: 'Leverage machine learning, NLP, and intelligent automation to streamline your business processes.',
    longDescription: 'Our AI & Automation services help businesses harness the power of artificial intelligence to automate repetitive tasks, gain predictive insights, and make data-driven decisions.',
    features: JSON.stringify(['Machine Learning Models', 'Natural Language Processing', 'Predictive Analytics', 'Process Automation', 'Chatbots & Virtual Assistants', 'Computer Vision']),
    benefits: JSON.stringify(['40% reduction in manual tasks', 'Real-time data-driven decisions', 'Scalable AI infrastructure', 'Competitive advantage through AI']),
    process: JSON.stringify(['Discovery & Data Assessment', 'AI Strategy & Architecture', 'Model Development & Training', 'Integration & Deployment']),
    products: [],
  },
};

export async function generateStaticParams() {
  const staticSlugs = staticServices.map((s) => ({ slug: s.slug }));
  return staticSlugs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const staticSvc = getStaticService(slug);
  if (staticSvc) {
    return baseGenerateMetadata({
      title: staticSvc.seoTitle,
      description: staticSvc.seoDescription,
      url: `/services/${slug}`,
    });
  }
  const service = await getServiceFromDb(slug);
  if (!service) return baseGenerateMetadata({ title: 'Service Not Found', url: `/services/${slug}` });
  return baseGenerateMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.description,
    url: `/services/${slug}`,
  });
}

async function getServiceFromDb(slug) {
  try {
    return await db.service.findUnique({
      where: { slug },
      select: {
        id: true, title: true, slug: true, icon: true, image: true, description: true, longDescription: true, features: true, benefits: true, process: true, pricing: true, ctaText: true, ctaLink: true, seoTitle: true, seoDescription: true,
        products: {
          where: { isActive: true },
          select: { id: true, title: true, slug: true, shortDescription: true, price: true, originalPrice: true, rating: true, image: true },
        },
      },
    });
  } catch { return null; }
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const staticSvc = getStaticService(slug);

  if (staticSvc) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: staticSvc.title,
      description: staticSvc.seoDescription,
      url: `https://aiopsmedia.com/services/${staticSvc.slug}`,
      provider: { '@type': 'Organization', name: 'AiOpsMedia', url: 'https://aiopsmedia.com' },
      serviceType: staticSvc.title,
      areaServed: { '@type': 'Country', name: 'Worldwide' },
    };
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiopsmedia.com/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://aiopsmedia.com/services' },
        { '@type': 'ListItem', position: 3, name: staticSvc.title },
      ],
    };
    const faqSchema = generateFAQSchema(staticSvc.faqs.map((f) => ({ question: f.q, answer: f.a })));
    const related = staticSvc.related.map((r) => getStaticService(r)).filter(Boolean);
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

        <section className="relative overflow-hidden bg-[#050816] pt-28 pb-16 sm:pt-36">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#22D3EE]/10 blur-[128px]" />
            <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/10 blur-[128px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: staticSvc.title }]} />
            <div className="mt-8 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">{staticSvc.hero}</h1>
              <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">{staticSvc.seoDescription}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg"><Link href="/book-consultation">Book a Free Consultation <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/estimate">Get a Project Estimate</Link></Button>
              </div>
              <p className="mt-4 text-xs text-[#94A3B8]/70">Built in India. Serving USA, UK, UAE & worldwide — no fake offices claimed.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#0B1220] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-[#F8FAFC]">Problem we solve</h2>
                <p className="mt-4 text-[#94A3B8] leading-relaxed">{staticSvc.problem}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#F8FAFC]">Our solution</h2>
                <p className="mt-4 text-[#94A3B8] leading-relaxed">{staticSvc.solution}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#050816] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Features</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {staticSvc.features.map((f) => (
                <div key={f} className="flex items-start gap-3 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-4"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#22D3EE]" /><span className="text-sm text-[#F8FAFC]">{f}</span></div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Use cases</h2>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {staticSvc.useCases.map((u) => <li key={u} className="flex gap-2 text-sm text-[#94A3B8]"><Star className="h-4 w-4 shrink-0 text-[#8B5CF6]" />{u}</li>)}
            </ul>

            <h2 className="mt-12 text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Technology approach</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {staticSvc.tech.map((t) => <span key={t} className="rounded-full border border-[rgba(148,163,184,0.15)] px-3 py-1 text-xs text-[#94A3B8]">{t}</span>)}
            </div>
            <p className="mt-3 text-xs text-[#94A3B8]/70">Only technologies actually used. No fabricated stack.</p>
          </div>
        </section>

        <section className="bg-[#0B1220] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Development process</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {staticSvc.process.map((step, i) => (
                <div key={step} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-4 text-center">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] text-xs font-bold text-[#050816]">0{i+1}</div>
                  <p className="mt-3 text-sm font-semibold text-[#F8FAFC]">{step}</p>
                </div>
              ))}
            </div>
            <h3 className="mt-8 text-lg font-bold text-[#F8FAFC]">Deliverables</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {staticSvc.deliverables.map((d) => <li key={d} className="flex gap-2 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 text-[#22D3EE]" />{d}</li>)}
            </ul>
          </div>
        </section>

        <section className="bg-[#050816] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Industries we serve</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {staticSvc.industries.map((ind) => <Link key={ind} href={`/industries/${ind.toLowerCase().replace(/ /g, '-').replace('&','').trim()}`} className="rounded-full border border-[rgba(148,163,184,0.15)] px-3 py-1 text-xs text-[#94A3B8] hover:text-[#22D3EE] hover:border-[#22D3EE]/30">{ind}</Link>)}
            </div>
            {related.length > 0 && (
              <>
                <h3 className="mt-10 text-lg font-bold text-[#F8FAFC]">Related services</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/services/${r.slug}`} className="group rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5 hover:border-[#22D3EE]/30">
                      <h4 className="font-semibold text-[#F8FAFC] group-hover:text-[#22D3EE]">{r.title}</h4>
                      <p className="mt-1 text-xs text-[#94A3B8]">{r.short}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs text-[#22D3EE]">View <ChevronRight className="h-3 w-3" /></span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bg-[#0B1220] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl text-center">FAQs</h2>
            <div className="mt-8 space-y-4">
              {staticSvc.faqs.map((f) => (
                <div key={f.q} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-5">
                  <h3 className="font-semibold text-[#F8FAFC]">{f.q}</h3>
                  <p className="mt-2 text-sm text-[#94A3B8]">{f.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-8 text-center">
              <h3 className="text-xl font-bold text-[#F8FAFC]">Ready to discuss {staticSvc.title}?</h3>
              <p className="mt-2 text-sm text-[#94A3B8]">Tell us what you are trying to build, improve or automate. We will propose the right architecture.</p>
              <div className="mt-6 flex justify-center gap-4">
                <Button asChild size="lg"><Link href="/book-consultation">Book Consultation</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/contact">Contact Us</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const service = (await getServiceFromDb(slug)) || fallbackServices[slug];
  if (!service) notFound();
  const features = service.features ? JSON.parse(service.features) : [];
  const benefits = service.benefits ? JSON.parse(service.benefits) : [];
  const processSteps = service.process ? JSON.parse(service.process) : [];
  const schema = generateServiceSchema(service);
  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      <section className="relative overflow-hidden bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: service.title }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">{service.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">{service.description}</p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg"><Link href={service.ctaLink || '/contact'}>{service.ctaText || 'Get a Free Consultation'} <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg"><Link href="/contact?type=call">Schedule a Call</Link></Button>
            </div>
          </div>
        </div>
      </section>
      {service.longDescription && (
        <section className="bg-[#0B1220] py-16"><div className="mx-auto max-w-3xl px-4"><h2 className="text-2xl font-bold text-[#F8FAFC]">Overview</h2><p className="mt-4 text-[#94A3B8] leading-relaxed">{service.longDescription}</p></div></section>
      )}
      {features.length > 0 && (
        <section className="bg-[#050816] py-16"><div className="mx-auto max-w-3xl px-4"><h2 className="text-2xl font-bold text-[#F8FAFC]">What We Offer</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{features.map((f) => <div key={f} className="flex items-start gap-3 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-4"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#22D3EE]" /><span className="text-sm text-[#F8FAFC]">{f}</span></div>)}</div></div></section>
      )}
      {benefits.length > 0 && (
        <section className="bg-[#0B1220] py-16"><div className="mx-auto max-w-3xl px-4"><h2 className="text-2xl font-bold text-[#F8FAFC]">Key Benefits</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{benefits.map((b) => <div key={b} className="flex items-start gap-3"><Star className="mt-0.5 h-5 w-5 shrink-0 text-[#8B5CF6]" /><span className="text-[#94A3B8]">{b}</span></div>)}</div></div></section>
      )}
      {processSteps.length > 0 && (
        <section className="bg-[#050816] py-16"><div className="mx-auto max-w-3xl px-4"><h2 className="text-2xl font-bold text-[#F8FAFC]">Our Process</h2><div className="mt-8 space-y-6">{processSteps.map((step, i) => <div key={i} className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] text-sm font-bold text-[#050816]">{i+1}</div><h3 className="font-semibold text-[#F8FAFC]">{step}</h3></div>)}</div></div></section>
      )}
      <CtaSection />
    </>
  );
}
