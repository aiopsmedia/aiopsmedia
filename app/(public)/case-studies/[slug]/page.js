import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Building2, Target, Lightbulb, Wrench, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/db';
import { generateMetadata as baseGenerateMetadata, generateCaseStudySchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config';
import { getCaseStudy as getStaticCaseStudy } from '@/lib/content/case-studies';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let cs = await getCaseStudy(slug);
  if (!cs) cs = getStaticCaseStudy(slug);
  if (!cs) return baseGenerateMetadata({ title: 'Case Study Not Found', url: `/case-studies/${slug}` });
  return baseGenerateMetadata({
    title: cs.seoTitle || cs.title,
    description: cs.seoDescription || cs.challenge || cs.solution || cs.summary,
    url: `/case-studies/${slug}`,
    type: 'article',
  });
}

async function getCaseStudy(slug) {
  try {
    return await db.caseStudy.findUnique({ where: { slug, isActive: true } });
  } catch { return null; }
}

function parseList(raw) {
  if (!raw) return [];
  try { const p = JSON.parse(raw); if (Array.isArray(p)) return p; } catch {}
  return raw.split(';').map((s) => s.trim()).filter(Boolean);
}
function parseResults(raw) {
  if (!raw) return [];
  try { const p = JSON.parse(raw); if (Array.isArray(p)) return p; } catch {}
  return raw.split(';').map((r) => ({ metric: r.trim(), label: '' })).filter((r) => r.metric);
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  let cs = await getCaseStudy(slug);
  let isStatic = false;
  let staticData = null;
  if (!cs) {
    staticData = getStaticCaseStudy(slug);
    if (staticData) {
      isStatic = true;
      cs = {
        title: staticData.title,
        slug: staticData.slug,
        client: `${staticData.market} — Illustrative`,
        industry: staticData.industry,
        challenge: staticData.challenge,
        solution: staticData.solution,
        implementation: `Architecture: ${staticData.architecture}. Features: ${staticData.features.join(', ')}. Workflow: ${staticData.workflow}. Technology: ${staticData.technology.join(', ')}`,
        results: staticData.outcomes,
        technologies: staticData.technology.join(', '),
        images: null,
      };
    }
  }
  if (!cs) notFound();
  const technologies = parseList(cs.technologies);
  const results = parseResults(cs.results);
  const schema = !isStatic ? generateCaseStudySchema(cs) : {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cs.title,
    description: cs.solution,
    url: `https://aiopsmedia.com/case-studies/${slug}`,
    author: { '@type': 'Organization', name: 'AiOpsMedia' },
  };

  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      <article className="bg-[#050816] pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Case Studies', href: '/case-studies' }, { label: cs.title }]} />
          {isStatic && (
            <div className="mt-6 flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200"><AlertTriangle className="h-4 w-4" /> Illustrative Case Study — Demo Concept. Not a real client engagement. No fabricated metrics.</div>
          )}
          <div className="mt-8">
            {cs.industry && <Badge variant="info">{cs.industry}</Badge>}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-5xl">{cs.title}</h1>
            {cs.client && <p className="mt-4 flex items-center gap-2 text-lg text-[#94A3B8]"><Building2 className="h-5 w-5 text-[#22D3EE]" /> Client: <span className="text-[#F8FAFC]">{cs.client}</span></p>}
          </div>
          {cs.images && <div className="mt-8 overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)]"><img src={cs.images.split(',')[0]} alt={cs.title} className="h-auto w-full object-cover" /></div>}
          <div className="mt-12 space-y-10">
            {cs.challenge && <section><h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]"><Target className="h-5 w-5 text-red-400" /> The Challenge</h2><p className="mt-3 leading-relaxed text-[#94A3B8]">{cs.challenge}</p></section>}
            {cs.solution && <section><h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]"><Lightbulb className="h-5 w-5 text-[#22D3EE]" /> Our Solution</h2><p className="mt-3 leading-relaxed text-[#94A3B8]">{cs.solution}</p></section>}
            {cs.implementation && <section><h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]"><Wrench className="h-5 w-5 text-violet-400" /> Implementation</h2><p className="mt-3 leading-relaxed text-[#94A3B8] whitespace-pre-line">{cs.implementation}</p></section>}
            {isStatic && staticData && (
              <>
                <section><h3 className="text-lg font-bold text-[#F8FAFC]">Business Requirements</h3><ul className="mt-2 list-disc pl-5 text-sm text-[#94A3B8]">{staticData.requirements.map((r) => <li key={r}>{r}</li>)}</ul></section>
                <section><h3 className="text-lg font-bold text-[#F8FAFC]">Architecture</h3><p className="mt-2 font-mono text-xs rounded-lg bg-[#0B1220] p-3 border border-[rgba(148,163,184,0.15)] text-[#94A3B8]">{staticData.architecture}</p></section>
                <section><h3 className="text-lg font-bold text-[#F8FAFC]">Features</h3><div className="mt-2 flex flex-wrap gap-2">{staticData.features.map((f) => <span key={f} className="rounded-full border border-[rgba(148,163,184,0.15)] px-3 py-1 text-xs text-[#94A3B8]">{f}</span>)}</div></section>
                <section><h3 className="text-lg font-bold text-[#F8FAFC]">Workflow</h3><p className="mt-2 text-sm text-[#94A3B8] font-mono bg-[#0B1220] p-3 rounded-lg border border-[rgba(148,163,184,0.15)]">{staticData.workflow}</p></section>
                <section><h3 className="text-lg font-bold text-[#F8FAFC]">Illustrative Benefits</h3><p className="mt-2 text-sm text-[#94A3B8]">{staticData.outcomes}</p></section>
              </>
            )}
            {results.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]"><BarChart3 className="h-5 w-5 text-emerald-400" /> The Results</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map((r, i) => <div key={i} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5 text-center"><div className="text-sm font-bold text-[#22D3EE]">{r.metric}</div>{r.label && <div className="mt-1 text-sm text-[#94A3B8]">{r.label}</div>}</div>)}</div>
              </section>
            )}
            {technologies.length > 0 && <section><h2 className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]"><TrendingUp className="h-5 w-5 text-[#8B5CF6]" /> Technologies Used</h2><div className="mt-3 flex flex-wrap gap-2">{technologies.map((t) => <span key={t} className="rounded-full border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-1 text-xs text-[#94A3B8]">{t}</span>)}</div></section>}
          </div>
          <div className="mt-16 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 text-center sm:p-10">
            <h2 className="text-2xl font-bold text-[#F8FAFC]">Ready to build your success story?</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#94A3B8]">Let&apos;s discuss how {siteConfig.name} can help your business achieve similar results with AI, automation, and custom software.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-[#050816] shadow-lg shadow-[#22D3EE]/20 hover:brightness-110">Start a Project</Link>
              <Link href="/case-studies" className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.15)] px-6 py-3 text-sm font-medium text-[#F8FAFC] hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"><ArrowLeft className="h-4 w-4" /> All Case Studies</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
