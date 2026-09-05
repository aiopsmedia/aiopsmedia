import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const defaultCaseStudies = [
  {
    id: 'cs-1',
    title: 'Streamlining School Operations with Digital ERP',
    client: 'Sunrise International School',
    industry: 'Education',
    challenge:
      'Manual attendance, fee collection, and parent communication processes were consuming 20+ hours per week of administrative time.',
    solution:
      'Deployed a comprehensive School ERP system with automated attendance tracking, online fee payments, exam management, and a parent portal.',
    results: [
      { metric: '85%', label: 'Reduction in admin time' },
      { metric: '99.9%', label: 'System uptime' },
      { metric: '2000+', label: 'Active parent users' },
    ],
    slug: 'sunrise-school-erp',
    image: null,
  },
  {
    id: 'cs-2',
    title: 'AI-Powered Lead Scoring for Real Estate',
    client: 'GreenLeaf Properties',
    industry: 'Real Estate',
    challenge:
      'Sales team spent hours qualifying leads manually, resulting in missed opportunities and slow response times.',
    solution:
      'Built an AI-powered lead scoring system integrated with their CRM, automatically ranking leads based on engagement and intent signals.',
    results: [
      { metric: '35%', label: 'Increase in conversions' },
      { metric: '60%', label: 'Faster response time' },
      { metric: '3x', label: 'ROI in first quarter' },
    ],
    slug: 'greenleaf-ai-lead-scoring',
    image: null,
  },
  {
    id: 'cs-3',
    title: 'Custom ERP for Retail Chain Management',
    client: 'ShopSmart Retail',
    industry: 'Retail',
    challenge:
      'Disparate systems for inventory, billing, and analytics across 12 store locations made consolidated reporting impossible.',
    solution:
      'Developed a unified ERP platform connecting all stores with real-time inventory sync, centralized billing, and a business intelligence dashboard.',
    results: [
      { metric: '12', label: 'Stores unified' },
      { metric: '40%', label: 'Inventory cost reduction' },
      { metric: 'Real-time', label: 'Business analytics' },
    ],
    slug: 'shopsmart-retail-erp',
    image: null,
  },
];

function CaseStudiesSection({ caseStudies }) {
  const items = caseStudies && caseStudies.length > 0 ? caseStudies : defaultCaseStudies;

  return (
    <section className="bg-[#050816] py-20 sm:py-28" aria-labelledby="casestudies-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="casestudies-heading" className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
              Case{' '}
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Studies</span>
            </h2>
            <p className="mt-3 max-w-xl text-[#94A3B8]">
              See how we have helped businesses transform through technology.
            </p>
          </div>
          <Link
            href="/case-studies"
            className="hidden items-center gap-1 text-sm font-medium text-[#22D3EE] transition-colors hover:underline sm:inline-flex"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cs) => (
            <div
              key={cs.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] transition-all duration-300 hover:border-[#22D3EE]/20 hover:shadow-lg hover:shadow-[#22D3EE]/5"
            >
              <div className="relative h-40 bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10">
                {cs.image ? (
                  <img src={cs.image} alt={cs.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-[#22D3EE]/20" />
                  </div>
                )}
                <Badge className="absolute top-3 left-3" variant="info">
                  {cs.industry}
                </Badge>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold text-[#F8FAFC] line-clamp-2">{cs.title}</h3>
                <p className="mt-1 text-xs text-[#94A3B8]">{cs.client}</p>

                <div className="mt-3 space-y-2">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-red-400">Challenge</span>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#94A3B8] line-clamp-2">{cs.challenge}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-[#22D3EE]">Solution</span>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#94A3B8] line-clamp-2">{cs.solution}</p>
                  </div>
                </div>

                {cs.results && (
                  <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-[rgba(148,163,184,0.15)]">
                    {cs.results.map((r) => (
                      <div key={r.label} className="text-center">
                        <div className="text-sm font-bold text-[#22D3EE]">{r.metric}</div>
                        <div className="text-[10px] text-[#94A3B8]">{r.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#22D3EE] transition-all hover:underline"
                >
                  Read Full Case Study <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/case-studies">
              View All Case Studies <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { CaseStudiesSection };
