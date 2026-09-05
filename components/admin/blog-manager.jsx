'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { PenLine, Pencil, Trash2, Eye } from 'lucide-react';
import { toggleBlogPublished, toggleBlogFeatured, deleteBlog } from '@/actions/cms';

export default function BlogManager({ initialPosts, currentStatus }) {
  const router = useRouter();
  const [posts, setPosts] = React.useState(initialPosts);
  const [deleteId, setDeleteId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const setTab = (value) => router.push(`/admin/cms/blog?status=${value}`);

  const handlePublish = async (id, checked) => {
    const res = await toggleBlogPublished(id, checked);
    if (res?.error) toast.error(res.error);
    else {
      toast.success(checked ? 'Post published' : 'Post unpublished');
      router.refresh();
    }
  };

  const handleFeatured = async (id, checked) => {
    const res = await toggleBlogFeatured(id, checked);
    if (res?.error) toast.error(res.error);
    else router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await deleteBlog(deleteId);
      if (res?.error) toast.error(res.error);
      else {
        toast.success('Post deleted');
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Blog Posts</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Write, edit, and publish blog articles.</p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/blog/new">
            <PenLine className="h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={currentStatus} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      {posts.length === 0 ? (
        <Card>
          <EmptyState icon={PenLine} title="No posts found" description="Write your first blog post." action="New Post" onAction={() => {}} />
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-[rgba(148,163,184,0.1)]">
            {posts.map((post) => (
              <div key={post.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#111827]/40">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <PenLine className="h-6 w-6 text-[#94A3B8]/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[#F8FAFC]">{post.title}</p>
                    <Badge variant={post.isPublished ? 'success' : 'warning'}>{post.isPublished ? 'Published' : 'Draft'}</Badge>
                    {post.isFeatured && <Badge variant="default">Featured</Badge>}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-[#94A3B8]">
                    By {post.author?.name || 'Unknown'} · {post.viewCount} views · {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94A3B8]">Publish</span>
                    <Switch checked={post.isPublished} onCheckedChange={(c) => handlePublish(post.id, c)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94A3B8]">Featured</span>
                    <Switch checked={post.isFeatured} onCheckedChange={(c) => handleFeatured(post.id, c)} />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild><Link href={`/blog/${post.slug}`}><Eye className="h-4 w-4" /></Link></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild><Link href={`/admin/cms/blog/${post.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => setDeleteId(post.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Post</ModalTitle>
            <ModalDescription>Are you sure you want to delete this blog post?</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} loading={loading}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
