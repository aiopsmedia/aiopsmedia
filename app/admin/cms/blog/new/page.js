import Link from 'next/link';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import BlogEditor from '@/components/admin/blog-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'New Blog Post - AIOpsMedia Admin',
};

export default async function NewBlogPage() {
  await requireAuth();

  const [categories, services, authors] = await Promise.all([
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

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
          <Link href="/admin/cms/blog">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">New Blog Post</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Write, edit, and publish a new blog article.</p>
      </div>

      <BlogEditor categories={categories} services={services} authors={authors} />
    </div>
  );
}