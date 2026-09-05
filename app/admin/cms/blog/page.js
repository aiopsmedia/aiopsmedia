import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import BlogManager from '@/components/admin/blog-manager';

export const metadata = {
  title: 'Blog - AIOpsMedia Admin',
};

export default async function BlogPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const status = sp?.status || 'all';

  const where = status === 'published' ? { isPublished: true } : status === 'draft' ? { isPublished: false } : {};

  const posts = await db.blog.findMany({
    where,
    include: {
      author: { select: { name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return <BlogManager initialPosts={posts} currentStatus={status} />;
}
