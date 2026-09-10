import Link from 'next/link';
import { Search } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { services } from '@/lib/content/services';
import { industries } from '@/lib/content/industries';
import { blogs } from '@/lib/content/blogs';
import { caseStudies } from '@/lib/content/case-studies';

export const metadata = {
  ...baseGenerateMetadata({
    title: 'Search | AiOpsMedia',
    description: 'Search blogs, services, case studies and industries.',
    url: '/search',
  }),
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q || '').toLowerCase().trim();
  const hasQuery = q.length > 0;

  let results = [];
  if (hasQuery) {
    const serviceHits = services.filter((s) => s.title.toLowerCase().includes(q) || s.short.toLowerCase().includes(q)).map((s) => ({ type: 'Service', title: s.title, href: `/services/${s.slug}`, excerpt: s.short }));
    const industryHits = industries.filter((i) => i.title.toLowerCase().includes(q) || i.short.toLowerCase().includes(q)).map((i) => ({ type: 'Industry', title: i.title, href: `/industries/${i.slug}`, excerpt: i.short }));
    const blogHits = blogs.filter((b) => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.tags.join(' ').toLowerCase().includes(q)).map((b) => ({ type: 'Blog', title: b.title, href: `/blog/${b.slug}`, excerpt: b.description }));
    const caseHits = caseStudies.filter((c) => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)).map((c) => ({ type: 'Case Study', title: c.title, href: `/case-studies/${c.slug}`, excerpt: c.summary }));
    results = [...serviceHits, ...industryHits, ...blogHits, ...caseHits].slice(0, 20);
  }

  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
        <div className="mt-8 max-w-2xl">
          <h1 className="text-4xl font-extrabold text-[#F8FAFC]">Search</h1>
          <form action="/search" method="get" className="relative mt-6">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input type="text" name="q" defaultValue={params?.q || ''} placeholder="Search blogs, services, case studies..." className="h-12 w-full rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] pl-11 pr-4 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus:border-[#22D3EE]/50 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50" />
          </form>
          {hasQuery && <p className="mt-3 text-sm text-[#94A3B8]">{results.length} results for &quot;{q}&quot;</p>}
        </div>

        {hasQuery ? (
          results.length > 0 ? (
            <div className="mt-10 grid gap-4">
              {results.map((r) => (
                <Link key={r.href} href={r.href} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5 hover:border-[#22D3EE]/30">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#22D3EE]">{r.type}</span>
                  <h3 className="mt-1 font-semibold text-[#F8FAFC]">{r.title}</h3>
                  <p className="mt-1 text-sm text-[#94A3B8]">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 text-center">
              <p className="text-[#94A3B8]">No results found. Try different keywords or browse <Link href="/services" className="text-[#22D3EE]">services</Link>, <Link href="/blog" className="text-[#22D3EE]">blog</Link> or <Link href="/industries" className="text-[#94A3B8]">industries</Link>.</p>
            </div>
          )
        ) : (
          <div className="mt-10 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6">
            <p className="text-sm text-[#94A3B8]">Try searching for &quot;AI agents&quot;, &quot;CRM&quot;, &quot;real estate&quot;, &quot;automation&quot; or &quot;ERP&quot;.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['AI Development','CRM','Real Estate','ERP','Automation','UAE'].map((k) => <Link key={k} href={`/search?q=${encodeURIComponent(k)}`} className="rounded-full border border-[rgba(148,163,184,0.15)] px-3 py-1 text-xs text-[#94A3B8] hover:text-[#22D3EE]">{k}</Link>)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
