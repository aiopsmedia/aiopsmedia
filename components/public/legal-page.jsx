import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getLegalContent } from '@/lib/legal-content';
import { generateMetadata as baseGenerateMetadata, generateLegalPageSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { siteConfig } from '@/config';

const LEGAL_PAGES = [
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms-conditions', label: 'Terms & Conditions' },
  { slug: 'refund-policy', label: 'Refund & Cancellation' },
  { slug: 'cookies-policy', label: 'Cookies Policy' },
  { slug: 'data-protection', label: 'Data Protection' },
  { slug: 'disclaimer', label: 'Disclaimer' },
  { slug: 'accessibility', label: 'Accessibility' },
];

export async function getLegalMetadata(slug) {
  const fallback = getLegalContent(slug);
  if (!fallback) return baseGenerateMetadata({ title: 'Page Not Found', url: `/${slug}` });

  const cms = await getCmsPage(slug);

  return baseGenerateMetadata({
    title: cms?.seoTitle || fallback.title,
    description: cms?.seoDescription || fallback.intro,
    url: `/${slug}`,
  });
}

async function getCmsPage(slug) {
  try {
    const page = await db.page.findUnique({ where: { slug, isPublished: true } });
    return page;
  } catch {
    return null;
  }
}

export async function LegalPage({ slug }) {
  const fallback = getLegalContent(slug);
  const cms = await getCmsPage(slug);

  if (!fallback && !cms) notFound();

  const title = cms?.title || fallback.title;
  const intro = cms && cms.content ? cms.seoDescription || fallback?.intro : fallback?.intro;
  const schema = generateLegalPageSchema({ title, seoDescription: cms?.seoDescription || intro }, `/${slug}`);

  const sections = cms && cms.content
    ? null
    : fallback?.sections || [];

  return (
    <>
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}

      <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: title },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
              {title}
            </h1>
            {fallback?.updated && (
              <p className="mt-2 text-sm text-[#94A3B8]">{fallback.updated}</p>
            )}
          </div>

          <div className="mt-8">
            {cms && cms.content ? (
              <div
                className="prose-custom max-w-none text-[#94A3B8] leading-relaxed
                  [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#F8FAFC]
                  [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#F8FAFC]
                  [&_p]:mb-4 [&_p]:text-[#94A3B8]
                  [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul_li]:mb-2
                  [&_ol]:mb-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol_li]:mb-2
                  [&_a]:text-[#22D3EE] [&_a]:underline [&_a]:decoration-[#22D3EE]/30 [&_a]:underline-offset-4"
                dangerouslySetInnerHTML={{ __html: cms.content }}
              />
            ) : (
              <>
                <p className="text-[#94A3B8] leading-relaxed">{intro}</p>
                <div className="mt-8 space-y-8">
                  {sections.map((section) => (
                    <section key={section.heading}>
                      <h2 className="text-xl font-bold text-[#F8FAFC]">{section.heading}</h2>
                      <p className="mt-2 leading-relaxed text-[#94A3B8]">{section.body}</p>
                    </section>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-12 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F8FAFC]">Other Legal Pages</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {LEGAL_PAGES.filter((p) => p.slug !== slug).map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="rounded-full border border-[rgba(148,163,184,0.15)] px-3 py-1 text-xs text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-8 text-sm text-[#94A3B8]">
            Questions about this page? Contact us at{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-[#22D3EE] hover:underline">
              {siteConfig.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}

export { LEGAL_PAGES };
