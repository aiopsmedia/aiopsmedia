import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const defaultPosts = [
  {
    id: 'post-1',
    title: 'How AI is Transforming Business Operations in 2026',
    excerpt:
      'Explore the latest AI trends reshaping how businesses automate workflows, predict outcomes, and make data-driven decisions.',
    slug: 'ai-transforming-business-operations-2026',
    category: 'AI & Automation',
    publishedAt: '2026-08-15',
    readingTime: 5,
    coverImage: null,
  },
  {
    id: 'post-2',
    title: 'Building Scalable ERP Systems: Best Practices',
    excerpt:
      'A deep dive into the architecture decisions, technology choices, and design patterns that make ERP systems maintainable at scale.',
    slug: 'building-scalable-erp-systems',
    category: 'Development',
    publishedAt: '2026-08-01',
    readingTime: 8,
    coverImage: null,
  },
  {
    id: 'post-3',
    title: 'Why Every School Needs a Digital Management System',
    excerpt:
      'From attendance tracking to parent communication — learn how modern school ERP systems are eliminating administrative overhead.',
    slug: 'why-schools-need-digital-management',
    category: 'Education',
    publishedAt: '2026-07-20',
    readingTime: 4,
    coverImage: null,
  },
];

function FeaturedBlogSection({ posts }) {
  const items = posts && posts.length > 0 ? posts : defaultPosts;

  return (
    <section className="bg-[#0B1220] py-20 sm:py-28" aria-labelledby="blog-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="blog-heading" className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
              Latest from our{' '}
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Blog</span>
            </h2>
            <p className="mt-3 text-[#94A3B8]">
              Insights, tutorials, and industry updates from our team.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1 text-sm font-medium text-[#22D3EE] transition-colors hover:underline sm:inline-flex"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <Link
              key={post.id || post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] transition-all duration-300 hover:border-[#22D3EE]/20 hover:shadow-lg hover:shadow-[#22D3EE]/5"
            >
              <div className="relative h-44 bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10">
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
                  <Badge variant="default">{post.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min read
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-[#F8FAFC] line-clamp-2 transition-colors group-hover:text-[#22D3EE]">
                  {post.title}
                </h3>
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

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#22D3EE]"
          >
            View All Posts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export { FeaturedBlogSection };
