import Link from 'next/link';
import { ArrowRight, TrendingUp, Building2, Target } from 'lucide-react';
import { db } from '@/lib/db';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Badge } from '@/components/ui/badge';

export const metadata = baseGenerateMetadata({
  title: 'Case Studies',
  description:
    'Explore AIOpsMedia case studies — real results from AI, ERP, web, and automation projects across education, real estate, retail, and more.',
  url: '/case-studies',
});

function parseResults(results) {
  if (!results) return [];
  try {
    const parsed = JSON.parse(results);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON
  }
  return results.split(';').map((r, i) => ({ metric: `M${i + 1}`, label: r.trim() })).filter((r) => r.label);
}

export default async function CaseStudiesPage() {
  let caseStudies = [];
  try {
    caseStudies = await db.caseStudy.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    caseStudies = [];
  }

  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Case Studies' },
            ]}
          />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
            Case{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Studies
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">
            See how we have helped businesses transform through technology — real problems, real solutions,
            measurable results.
          </p>
        </div>

        {caseStudies.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-12 text-center">
            <Target className="mx-auto h-10 w-10 text-[#22D3EE]/30" />
            <h2 className="mt-4 text-xl font-bold text-[#F8FAFC]">Case studies coming soon</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#94A3B8]">
              We&apos;re documenting our latest client success stories. While you wait, explore our services
              to see how we can help your business.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816] shadow-lg shadow-[#22D3EE]/20 transition-all hover:brightness-110"
            >
              Explore Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => {
              const results = parseResults(cs.results);
              return (
                <Link
                  key={cs.id || cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-lg hover:shadow-[#22D3EE]/5"
                >
                  <div className="relative h-40 bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10">
                    {cs.images ? (
                      <img src={cs.images.split(',')[0]} alt={cs.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-[#22D3EE]/20" />
                      </div>
                    )}
                    {cs.industry && <Badge className="absolute top-3 left-3" variant="info">{cs.industry}</Badge>}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-base font-semibold text-[#F8FAFC] line-clamp-2 group-hover:text-[#22D3EE]">{cs.title}</h2>
                    {cs.client && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#94A3B8]">
                        <Building2 className="h-3 w-3" /> {cs.client}
                      </p>
                    )}

                    {cs.challenge && (
                      <div className="mt-3">
                        <span className="text-xs font-medium uppercase tracking-wider text-red-400">Challenge</span>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#94A3B8] line-clamp-2">{cs.challenge}</p>
                      </div>
                    )}

                    {results.length > 0 && (
                      <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-[rgba(148,163,184,0.15)]">
                        {results.slice(0, 3).map((r, i) => (
                          <div key={i} className="text-center">
                            <div className="text-sm font-bold text-[#22D3EE]">{r.metric}</div>
                            <div className="text-[10px] text-[#94A3B8] line-clamp-1">{r.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#22D3EE] transition-all group-hover:gap-2">
                      Read Full Case Study <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
