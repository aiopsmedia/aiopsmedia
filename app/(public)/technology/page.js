import Link from 'next/link';
import { CheckCircle, ArrowRight, Code2, Database, Cloud, Cpu, Shield, Boxes } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata = baseGenerateMetadata({
  title: 'Technology Stack | AiOpsMedia',
  description: 'Frontend, backend, databases, cloud, APIs, AI, automation, security and monitoring — only technologies AiOpsMedia actually uses.',
  url: '/technology',
});

const stack = [
  { group: 'Frontend', items: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'] },
  { group: 'Backend', items: ['Node.js', 'REST APIs', 'Prisma ORM'] },
  { group: 'Databases', items: ['PostgreSQL', 'MongoDB'] },
  { group: 'Cloud & DevOps', items: ['Vercel', 'AWS / GCP concepts', 'Docker (where appropriate)'] },
  { group: 'AI / Automation', items: ['LLM APIs (Groq)', 'Vector Search (pgvector)', 'RAG', 'Workflow automation'] },
  { group: 'Security & Monitoring', items: ['Auth.js', 'Rate limiting', 'Audit logs', 'Error monitoring'] },
];

export default function TechnologyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Technology Stack — AiOpsMedia',
    url: 'https://aiopsmedia.com/technology',
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Technology' }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">Our <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Technology</span></h1>
            <p className="mt-4 text-lg text-[#94A3B8]">We list only what we actually use. No inflated stack for marketing. Every technology serves a real delivery purpose.</p>
          </div>
        </div>
      </section>
      <section className="bg-[#0B1220] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((g) => (
            <div key={g.group} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-6">
              <h3 className="font-bold text-[#F8FAFC]">{g.group}</h3>
              <ul className="mt-3 space-y-2">
                {g.items.map((it) => <li key={it} className="flex gap-2 text-sm text-[#94A3B8]"><CheckCircle className="h-4 w-4 text-[#22D3EE]" />{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-[#050816] py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Principles</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#94A3B8]">
            <li>• Server components where possible, minimal client JS, Core Web Vitals priority.</li>
            <li>• Data ownership stays with you — repos and backups in your cloud.</li>
            <li>• Secure by default: validation, rate limiting, audit trails.</li>
            <li>• We do not claim technologies we have not shipped.</li>
          </ul>
          <div className="mt-8 flex gap-4">
            <Link href="/services" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816]">Explore Services <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/contact" className="inline-flex items-center rounded-xl border border-[rgba(148,163,184,0.15)] px-8 py-3 text-sm text-[#F8FAFC]">Contact Engineering</Link>
          </div>
        </div>
      </section>
    </>
  );
}
