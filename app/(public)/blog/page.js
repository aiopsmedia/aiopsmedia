import Link from 'next/link';
import { Search, Clock, Calendar, ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogs as staticBlogs } from '@/lib/content/blogs';

export const metadata = baseGenerateMetadata({
  title: 'Blog',
  description:
    'Insights, tutorials, and industry updates from the AIOpsMedia team. Learn about AI, automation, software development, and digital transformation.',
  url: '/blog',
});

const POSTS_PER_PAGE = 9;

async function getBlogData(page, search, category) {
  const pageNum = Math.max(1, page || 1);
  const skip = (pageNum - 1) * POSTS_PER_PAGE;

  const where = { isPublished: true };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { tags: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  try {
    const [posts, total, categories] = await Promise.all([
      db.blog.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: POSTS_PER_PAGE,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          publishedAt: true,
          readingTime: true,
          tags: true,
          category: { select: { name: true, slug: true } },
          author: { select: { name: true, image: true } },
        },
      }),
      db.blog.count({ where }),
      db.blogCategory.findMany({
        where: { isActive: true },
        select: { name: true, slug: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      posts,
      totalPages: Math.ceil(total / POSTS_PER_PAGE),
      currentPage: pageNum,
      categories,
    };
  } catch {
    return {
      posts: [],
      totalPages: 1,
      currentPage: 1,
      categories: [],
    };
  }
}

const fallbackPosts = staticBlogs.slice(0, 9).map((b, i) => ({
  id: `static-${i}`,
  title: b.title,
  slug: b.slug,
  excerpt: b.description,
  coverImage: null,
  publishedAt: new Date(b.publishedAt),
  readingTime: b.readingTime,
  tags: b.tags.join(','),
  category: { name: b.category, slug: b.category.toLowerCase().replace(/ /g, '-') },
  author: { name: 'AIOpsMedia Team', image: null },
}));
const allFallback = staticBlogs.map((b, i) => ({
  id: `static-${i}`,
  title: b.title,
  slug: b.slug,
  excerpt: b.description,
  coverImage: null,
  publishedAt: new Date(b.publishedAt),
  readingTime: b.readingTime,
  tags: b.tags.join(','),
  category: { name: b.category, slug: b.category.toLowerCase().replace(/ /g, '-') },
  author: { name: 'AIOpsMedia Team', image: null },
}));

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const search = params?.q || '';
  const category = params?.category || '';

  const { posts, totalPages, currentPage, categories } = await getBlogData(page, search, category);
  let displayPosts = posts.length > 0 ? posts : fallbackPosts;
  let displayTotal = totalPages;
  let isFallback = posts.length === 0;
  if (isFallback) {
    let filtered = allFallback;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s) || p.tags.toLowerCase().includes(s));
    }
    if (category) filtered = filtered.filter((p) => p.category.slug === category);
    const start = (page - 1) * 9;
    displayPosts = filtered.slice(start, start + 9);
    displayTotal = Math.max(1, Math.ceil(filtered.length / 9));
    // augment categories from static
    if (categories.length === 0) {
      // will be handled below
    }
  }

  function buildUrl(overrides) {
    const sp = new URLSearchParams();
    if (overrides.q || search) sp.set('q', overrides.q || search);
    if (overrides.category || category) sp.set('category', overrides.category || category);
    if (overrides.page) sp.set('page', String(overrides.page));
    const qs = sp.toString();
    return `/blog${qs ? `?${qs}` : ''}`;
  }

  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog' },
            ]}
          />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
            Our{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="mt-6 text-lg text-[#94A3B8]">
            Insights, tutorials, and industry updates from our team.
          </p>
        </div>

        <div className="mt-10 mx-auto max-w-2xl">
          <form action="/blog" method="get" className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Search articles..."
              className="h-12 w-full rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] pl-11 pr-4 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus:border-[#22D3EE]/50 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50"
            />
            {category && <input type="hidden" name="category" value={category} />}
          </form>
        </div>

        {(() => {
          const cats = categories.length > 0 ? categories : Array.from(new Set(allFallback.map((p) => p.category.slug))).map((slug) => {
            const first = allFallback.find((p) => p.category.slug === slug);
            return { name: first.category.name, slug };
          });
          return (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/blog"
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                !category
                  ? 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/20'
                  : 'border border-[rgba(148,163,184,0.15)] text-[#94A3B8] hover:border-[#22D3EE]/20'
              }`}
            >
              All
            </Link>
            {cats.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  category === cat.slug
                    ? 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/20'
                    : 'border border-[rgba(148,163,184,0.15)] text-[#94A3B8] hover:border-[#22D3EE]/20'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          );
        })()}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] transition-all duration-300 hover:border-[#22D3EE]/20 hover:shadow-lg hover:shadow-[#22D3EE]/5"
            >
              <div className="relative h-48 bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm font-medium text-[#94A3B8]/40">AIOpsMedia Blog</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3">
                  {post.category && <Badge variant="default">{post.category.name}</Badge>}
                  <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                    <Clock className="h-3 w-3" />
                    {post.readingTime || 5} min read
                  </span>
                </div>

                <h2 className="mt-3 text-base font-semibold text-[#F8FAFC] line-clamp-2 transition-colors group-hover:text-[#22D3EE]">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8] line-clamp-2">{post.excerpt}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="text-xs font-medium text-[#22D3EE] transition-all group-hover:underline">
                    Read More
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(isFallback ? displayTotal : totalPages) > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
            {currentPage > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={buildUrl({ page: currentPage - 1 })}>Previous</Link>
              </Button>
            )}

            {Array.from({ length: (isFallback ? displayTotal : totalPages) }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                asChild
                variant={p === currentPage ? 'default' : 'ghost'}
                size="icon"
                className="h-9 w-9 text-xs"
              >
                <Link href={buildUrl({ page: p })}>{p}</Link>
              </Button>
            ))}

            {currentPage < (isFallback ? displayTotal : totalPages) && (
              <Button asChild variant="outline" size="sm">
                <Link href={buildUrl({ page: currentPage + 1 })}>Next</Link>
              </Button>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
