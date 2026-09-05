import Link from 'next/link';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';
import { db } from '@/lib/db';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FaqSection } from '@/components/public/faq-section';

export const metadata = baseGenerateMetadata({
  title: 'Pricing',
  description:
    'Transparent pricing for AIOpsMedia services and ERP products. Choose the right plan for your business.',
  url: '/pricing',
});

const servicePackages = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses and startups',
    price: '₹49,999',
    period: 'starting from',
    popular: false,
    features: [
      'Up to 5 pages website',
      'Basic SEO setup',
      'Responsive design',
      'Contact form integration',
      '1 month free support',
      'SSL certificate',
    ],
    cta: 'Get Started',
    ctaLink: '/contact?service=web-development&budget=Under+₹50,000',
  },
  {
    name: 'Professional',
    description: 'For growing businesses with custom needs',
    price: '₹1,99,999',
    period: 'starting from',
    popular: true,
    features: [
      'Custom web application',
      'Admin dashboard',
      'Database design & API',
      'Authentication & roles',
      'Advanced SEO',
      '3 months free support',
      'Performance optimization',
      'Analytics integration',
    ],
    cta: 'Start Building',
    ctaLink: '/contact?service=Custom+Software+Development&budget=₹2,00,000+-+₹5,00,000',
  },
  {
    name: 'Enterprise',
    description: 'Full-scale solutions for large organizations',
    price: 'Custom',
    period: 'tailored quote',
    popular: false,
    features: [
      'Everything in Professional',
      'AI & automation integration',
      'Microservices architecture',
      'Cloud infrastructure (AWS/GCP)',
      'Dedicated project manager',
      'SLA-backed support',
      'Security audit & compliance',
      'Custom integrations',
      'Priority support',
    ],
    cta: 'Talk to an Expert',
    ctaLink: '/contact?budget=Above+₹10,00,000',
  },
];

const productPricing = [
  {
    name: 'RealEstate ERP',
    price: '₹9,999',
    originalPrice: '₹49,999',
    period: '/year',
    features: [
      'Property management',
      'Lead tracking & scoring',
      'Billing & invoicing',
      'Client portal',
      'WhatsApp integration',
      'Mobile app access',
      'Free data migration',
      '1 year free updates',
    ],
    cta: 'Get Started',
    href: '/products/realestate-erp',
  },
  {
    name: 'School ERP',
    price: '₹7,999',
    originalPrice: '₹39,999',
    period: '/year',
    features: [
      'Student management',
      'Attendance tracking',
      'Fee collection & receipts',
      'Exam & results',
      'Parent portal',
      'Timetable scheduling',
      'Library management',
      '1 year free updates',
    ],
    cta: 'Get Started',
    href: '/products/school-erp',
  },
];

const comparisonFeatures = [
  { name: 'Custom Design', starter: true, pro: true, enterprise: true },
  { name: 'Responsive / Mobile', starter: true, pro: true, enterprise: true },
  { name: 'SEO Optimization', starter: 'Basic', pro: 'Advanced', enterprise: 'Full' },
  { name: 'Admin Dashboard', starter: false, pro: true, enterprise: true },
  { name: 'API Development', starter: false, pro: true, enterprise: true },
  { name: 'Authentication & RBAC', starter: false, pro: true, enterprise: true },
  { name: 'AI / ML Integration', starter: false, pro: false, enterprise: true },
  { name: 'Cloud Infrastructure', starter: false, pro: false, enterprise: true },
  { name: 'Dedicated PM', starter: false, pro: false, enterprise: true },
  { name: 'SLA Support', starter: false, pro: false, enterprise: true },
  { name: 'Security Audit', starter: false, pro: false, enterprise: true },
  { name: 'Free Support', starter: '1 month', pro: '3 months', enterprise: '6 months' },
];

async function getFaqs() {
  try {
    return await db.fAQ.findMany({
      where: { isActive: true, category: 'pricing' },
      orderBy: { order: 'asc' },
      select: { id: true, question: true, answer: true },
    });
  } catch {
    return [];
  }
}

const pricingFaqs = [
  { id: 'p1', question: 'Do you offer payment plans?', answer: 'Yes, for projects above ₹2,00,000 we offer flexible payment plans — typically 40% upfront, 30% at midpoint, and 30% on delivery. Contact us for custom arrangements.' },
  { id: 'p2', question: 'What\'s included in the free support period?', answer: 'Bug fixes, minor updates, performance monitoring, and email support. Feature additions and major changes are quoted separately.' },
  { id: 'p3', question: 'Are there any hidden costs?', answer: 'No. Our quotes include everything needed for the agreed scope. Third-party services (hosting, domains, APIs) are billed at actual cost with no markup.' },
  { id: 'p4', question: 'Can I upgrade my ERP plan later?', answer: 'Absolutely. You can upgrade your plan at any time. We\'ll prorate the difference for the remaining period.' },
  { id: 'p5', question: 'Do you offer discounts for nonprofits or startups?', answer: 'Yes, we offer special pricing for registered nonprofits and early-stage startups. Mention this when you contact us.' },
];

export default async function PricingPage() {
  return (
    <>
      <section className="bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Pricing' },
              ]}
            />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
              Simple,{' '}
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
                Transparent
              </span>{' '}
              Pricing
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">
              Whether you need a custom solution or an off-the-shelf ERP product,
              we have pricing options to fit your budget.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#F8FAFC]">
              Service Packages
            </h2>
            <p className="mt-3 text-[#94A3B8]">Custom development & digital solutions</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {servicePackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  pkg.popular
                    ? 'border-[#22D3EE]/40 bg-[#050816] shadow-lg shadow-[#22D3EE]/10'
                    : 'border-[rgba(148,163,184,0.15)] bg-[#050816]'
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                    Most Popular
                  </Badge>
                )}

                <h3 className="text-xl font-bold text-[#F8FAFC]">{pkg.name}</h3>
                <p className="mt-1 text-sm text-[#94A3B8]">{pkg.description}</p>

                <div className="mt-6">
                  <span className="text-3xl font-extrabold text-[#F8FAFC]">{pkg.price}</span>
                  <span className="ml-2 text-sm text-[#94A3B8]">{pkg.period}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={pkg.popular ? 'default' : 'outline'}
                  size="lg"
                  className="mt-8 w-full"
                >
                  <Link href={pkg.ctaLink}>
                    {pkg.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#F8FAFC]">
              ERP{' '}
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="mt-3 text-[#94A3B8]">Ready-to-deploy industry solutions</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {productPricing.map((product) => (
              <div
                key={product.name}
                className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8"
              >
                <h3 className="text-xl font-bold text-[#F8FAFC]">{product.name}</h3>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#22D3EE]">{product.price}</span>
                  <span className="text-sm text-[#94A3B8]">{product.period}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#94A3B8] line-through">{product.originalPrice}</span>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" size="lg" className="mt-8 w-full">
                  <Link href={product.href}>
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#F8FAFC]">Feature Comparison</h2>
            <p className="mt-3 text-[#94A3B8]">Service packages side-by-side</p>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[rgba(148,163,184,0.15)]">
                  <th className="py-4 pr-4 text-left text-sm font-semibold text-[#F8FAFC]">Feature</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-[#F8FAFC]">Starter</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-[#22D3EE]">Professional</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-[#F8FAFC]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((f, i) => (
                  <tr key={f.name} className={`border-b border-[rgba(148,163,184,0.08)] ${i % 2 === 0 ? 'bg-[#050816]/50' : ''}`}>
                    <td className="py-3 pr-4 text-sm text-[#94A3B8]">{f.name}</td>
                    {['starter', 'pro', 'enterprise'].map((tier) => (
                      <td key={tier} className="px-4 py-3 text-center text-sm">
                        {typeof f[tier] === 'boolean' ? (
                          f[tier] ? (
                            <Check className="mx-auto h-4 w-4 text-[#22D3EE]" />
                          ) : (
                            <span className="text-[#94A3B8]/30">—</span>
                          )
                        ) : (
                          <span className="text-[#94A3B8]">{f[tier]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#F8FAFC] text-center">
            Pricing{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              FAQ
            </span>
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {pricingFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0B1220] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-[#22D3EE]/5 via-transparent to-[#8B5CF6]/5" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#F8FAFC]">
            Need a Custom Solution?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#94A3B8]">
            Every business is unique. Let&apos;s discuss your specific requirements and
            create a tailored solution that fits your budget.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">
              Talk to an Expert <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
