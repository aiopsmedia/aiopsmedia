import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import BlogEditor from '@/components/admin/blog-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Edit Blog Post - AIOpsMedia Admin',
};

export default async function EditBlogPage({ params }) {
  await requireAuth();
  const { id } = await params;

  const [post, categories, services, authors] = await Promise.all([
    db.blog.findUnique({
      where: { id },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    }),
    db.blogCategory.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    db.service.findMany({
      where: { isActive: true },
      select: { id: true, title: true },
      orderBy: { order: 'asc' },
    }),
    db.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
          <Link href="/admin/cms/blog">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Edit Post</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Update details for {post.title}.</p>
      </div>

      <BlogEditor
        post={post}
        categories={categories}
        services={services}
        authors={authors}
      />
    </div>
  );
}