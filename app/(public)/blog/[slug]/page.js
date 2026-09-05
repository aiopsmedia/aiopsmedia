import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, Tag, ArrowLeft, Share2, Copy, CheckCircle } from 'lucide-react';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { generateMetadata as baseGenerateMetadata, generateArticleSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { ShareButtons } from './share-buttons';

const fallbackPost = {
  title: 'How AI is Transforming Business Operations in 2026',
  slug: 'ai-transforming-business-operations-2026',
  excerpt: 'Explore the latest AI trends reshaping how businesses automate workflows.',
  content: `<h2 id="introduction">Introduction</h2><p>Artificial intelligence is no longer a futuristic concept — it's here, and it's transforming how businesses operate at every level. In 2026, we're seeing unprecedented adoption of AI-powered tools across industries.</p><h2 id="key-trends">Key AI Trends</h2><p>From intelligent automation to predictive analytics, businesses are leveraging AI to make faster, more accurate decisions. Here are the top trends shaping 2026.</p><h2 id="practical-applications">Practical Applications</h2><p>Real-world examples of AI transforming operations in healthcare, education, real estate, and retail.</p><h2 id="getting-started">Getting Started with AI</h2><p>Steps your business can take today to begin the AI transformation journey.</p>`,
  coverImage: null,
  publishedAt: new Date('2026-08-15'),
  readingTime: 5,
  viewCount: 142,
  tags: 'AI,automation,business,2026,trends',
  category: { name: 'AI & Automation', slug: 'ai-automation' },
  author: { name: 'AIOpsMedia Team', image: null },
  seoTitle: null,
  metaDescription: null,
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return baseGenerateMetadata({ title: 'Post Not Found', url: `/blog/${slug}` });

  return baseGenerateMetadata({
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    url: `/blog/${slug}`,
    type: 'article',
  });
}

async function getPost(slug) {
  try {
    return await db.blog.findUnique({
      where: { slug, isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        publishedAt: true,
        readingTime: true,
        viewCount: true,
        tags: true,
        seoTitle: true,
        metaDescription: true,
        category: { select: { name: true, slug: true } },
        author: { select: { name: true, image: true } },
      },
    });
  } catch {
    return null;
  }
}

async function incrementViews(slug) {
  try {
    await db.blog.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // Non-critical
  }
}

async function getRelatedPosts(categorySlug, currentSlug) {
  if (!categorySlug) return [];
  try {
    return await db.blog.findMany({
      where: {
        isPublished: true,
        slug: { not: currentSlug },
        category: { slug: categorySlug },
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        readingTime: true,
        category: { select: { name: true } },
      },
    });
  } catch {
    return [];
  }
}

function extractHeadings(html) {
  if (!html) return [];
  const regex = /<h([2-3])\s+id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi;
  const headings = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    });
  }
  return headings;
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = (await getPost(slug)) || fallbackPost;

  if (!post) notFound();

  if (post.viewCount !== undefined && post !== fallbackPost) {
    incrementViews(slug);
  }

  const tags = post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const headings = extractHeadings(post.content);
  const relatedPosts = await getRelatedPosts(post.category?.slug, slug);

  const schema = generateArticleSchema({
    ...post,
    author: post.author || { name: 'AIOpsMedia Team' },
  });

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <article className="bg-[#050816] pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {post.category && <Badge variant="default">{post.category.name}</Badge>}
                <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                  <Clock className="h-3 w-3" />
                  {post.readingTime || 5} min read
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-4 text-lg text-[#94A3B8] leading-relaxed">{post.excerpt}</p>
              )}

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] text-sm font-bold text-[#050816]">
                  {post.author?.image ? (
                    <img src={post.author.image} alt={post.author.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    (post.author?.name || 'AT').split(' ').map((n) => n[0]).join('').slice(0, 2)
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">{post.author?.name || 'AIOpsMedia Team'}</p>
                  <p className="text-xs text-[#94A3B8]">Published on {formatDate(post.publishedAt)}</p>
                </div>
              </div>

              {post.coverImage && (
                <div className="mt-8 overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)]">
                  <img src={post.coverImage} alt={post.title} className="h-auto w-full object-cover" />
                </div>
              )}

              <div
                className="prose-custom mt-10 max-w-none text-[#94A3B8] leading-relaxed
                  [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#F8FAFC]
                  [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#F8FAFC]
                  [&_p]:mb-4 [&_p]:text-[#94A3B8]
                  [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul_li]:mb-2
                  [&_ol]:mb-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol_li]:mb-2
                  [&_a]:text-[#22D3EE] [&_a]:underline [&_a]:decoration-[#22D3EE]/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-[#22D3EE]
                  [&_blockquote]:border-l-[#22D3EE]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#94A3B8]/80
                  [&_code]:rounded [&_code]:bg-[#0B1220] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-[#22D3EE]
                  [&_pre]:rounded-xl [&_pre]:bg-[#0B1220] [&_pre]:p-4 [&_pre]:overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

              {tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-[rgba(148,163,184,0.15)] pt-6">
                  <Tag className="h-4 w-4 text-[#94A3B8]" />
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-1 text-xs text-[#94A3B8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-10 border-t border-[rgba(148,163,184,0.15)] pt-8">
                <ShareButtons url={`/blog/${slug}`} title={post.title} />
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                {headings.length > 0 && (
                  <div className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5">
                    <h3 className="text-sm font-semibold text-[#F8FAFC]">Table of Contents</h3>
                    <nav className="mt-3 space-y-2">
                      {headings.map((h) => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          className={`block text-xs text-[#94A3B8] transition-colors hover:text-[#22D3EE] ${
                            h.level === 3 ? 'pl-4' : ''
                          }`}
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                <div className="mt-6 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5">
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">Enjoyed this article?</h3>
                  <p className="mt-2 text-xs text-[#94A3B8]">
                    Share it with your network or reach out to discuss the topic.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#22D3EE] hover:underline"
                  >
                    Get in Touch <ArrowLeft className="h-3 w-3 rotate-180" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {relatedPosts.length > 0 && (
            <section className="mt-16 border-t border-[rgba(148,163,184,0.15)] pt-12">
              <h2 className="text-2xl font-bold text-[#F8FAFC]">Related Articles</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/blog/${rp.slug}`}
                    className="group overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] transition-all hover:border-[#22D3EE]/20"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10">
                      {rp.coverImage ? (
                        <img src={rp.coverImage} alt={rp.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-xs text-[#94A3B8]/40">AIOpsMedia</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {rp.category && <Badge variant="default" className="mb-2">{rp.category.name}</Badge>}
                      <h3 className="text-sm font-semibold text-[#F8FAFC] line-clamp-2 group-hover:text-[#22D3EE]">
                        {rp.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#94A3B8] line-clamp-2">{rp.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
