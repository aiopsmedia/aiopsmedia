import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Building2, Target, Lightbulb, Wrench, BarChart3, TrendingUp } from 'lucide-react';
import { db } from '@/lib/db';
import { generateMetadata as baseGenerateMetadata, generateCaseStudySchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);

  if (!cs) return baseGenerateMetadata({ title: 'Case Study Not Found', url: `/case-studies/${slug}` });

  return baseGenerateMetadata({
    title: cs.seoTitle || cs.title,
    description: cs.seoDescription || cs.challenge || cs.solution,
    url: `/case-studies/${slug}`,
    type: 'article',
  });
}

async function getCaseStudy(slug) {
  try {
    return await db.caseStudy.findUnique({
      where: { slug, isActive: true },
    });
  } catch {
    return null;
  }
}

function parseList(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON
  }
  return raw.split(';').map((s) => s.trim()).filter(Boolean);
}

function parseResults(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON
  }
  return raw.split(';').map((r) => ({ metric: r.trim(), label: '' })).filter((r) => r.metric);
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);

  if (!cs) notFound();

  const technologies = parseList(cs.technologies);
  const results = parseResults(cs.results);
  const schema = generateCaseStudySchema(cs);

  return (
    <>
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}

      <article className="bg-[#050816] pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Case Studies', href: '/case-studies' },
              { label: cs.title },
            ]}
          />

          <div className="mt-8">
            {cs.industry && <Badge variant="info">{cs.industry}</Badge>}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-5xl">
              {cs.title}
            </h1>

            {cs.client && (
              <p className="mt-4 flex items-center gap-2 text-lg text-[#94A3B8]">
                <Building2 className="h-5 w-5 text-[#22D3EE]" />
                Client: <span className="text-[#F8FAFC]">{cs.client}</span>
              </p>
            )}
          </div>

          {cs.images && (
            <div className="mt-8 overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)]">
              <img src={cs.images.split(',')[0]} alt={cs.title} className="h-auto w-full object-cover" />
            </div>
          )}

          <div className="mt-12 space-y-10">
            {cs.challenge && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]">
                  <Target className="h-5 w-5 text-red-400" /> The Challenge
                </h2>
                <p className="mt-3 leading-relaxed text-[#94A3B8]">{cs.challenge}</p>
              </section>
            )}

            {cs.solution && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]">
                  <Lightbulb className="h-5 w-5 text-[#22D3EE]" /> Our Solution
                </h2>
                <p className="mt-3 leading-relaxed text-[#94A3B8]">{cs.solution}</p>
              </section>
            )}

            {cs.implementation && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]">
                  <Wrench className="h-5 w-5 text-violet-400" /> Implementation
                </h2>
                <p className="mt-3 leading-relaxed text-[#94A3B8]">{cs.implementation}</p>
              </section>
            )}

            {results.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]">
                  <BarChart3 className="h-5 w-5 text-emerald-400" /> The Results
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((r, i) => (
                    <div key={i} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5 text-center">
                      <div className="text-2xl font-bold text-[#22D3EE]">{r.metric}</div>
                      {r.label && <div className="mt-1 text-sm text-[#94A3B8]">{r.label}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {technologies.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]">
                  <TrendingUp className="h-5 w-5 text-[#8B5CF6]" /> Technologies Used
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-1 text-xs text-[#94A3B8]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="mt-16 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 text-center sm:p-10">
            <h2 className="text-2xl font-bold text-[#F8FAFC]">Ready to build your success story?</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#94A3B8]">
              Let&apos;s discuss how {siteConfig.name} can help your business achieve similar results with
              AI, automation, and custom software.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-[#050816] shadow-lg shadow-[#22D3EE]/20 transition-all hover:brightness-110"
              >
                Start a Project
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] px-6 py-3 text-sm font-medium text-[#F8FAFC] transition-colors hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
              >
                <ArrowLeft className="h-4 w-4" /> All Case Studies
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
