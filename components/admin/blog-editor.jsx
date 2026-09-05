'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createBlog, updateBlog } from '@/actions/cms';
import { slugify, calculateReadingTime } from '@/lib/utils';
import { Sparkles, Loader2 } from 'lucide-react';

export default function BlogEditor({ post, categories, services, authors }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [aiGenerating, setAiGenerating] = React.useState(false);
  const [form, setForm] = React.useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    authorId: post?.authorId || '',
    categoryId: post?.categoryId || '',
    serviceId: post?.serviceId || '',
    tags: post?.tags || '',
    seoTitle: post?.seoTitle || '',
    metaDescription: post?.metaDescription || '',
    focusKeyword: post?.focusKeyword || '',
    canonicalUrl: post?.canonicalUrl || '',
    ogTitle: post?.ogTitle || '',
    ogDescription: post?.ogDescription || '',
    ogImage: post?.ogImage || '',
    isPublished: post?.isPublished || false,
    isFeatured: post?.isFeatured || false,
  });

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({ ...prev, title, slug: prev.slug || slugify(title) }));
  };

  async function generateWithAi() {
    const topic = form.title?.trim() || form.focusKeyword?.trim();
    if (!topic) {
      toast.error('Enter a title or focus keyword first');
      return;
    }

    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai/blog-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, focusKeyword: form.focusKeyword }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.content) {
        setField('content', data.content);
        if (data.excerpt) setField('excerpt', data.excerpt);
        if (data.metaDescription) setField('metaDescription', data.metaDescription);
        if (data.tags) setField('tags', data.tags);
        toast.success('Content generated with AI');
      } else {
        toast.error(data.error || 'Failed to generate content');
      }
    } catch {
      toast.error('AI generation failed. Check GROQ_API_KEY configuration.');
    } finally {
      setAiGenerating(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const readingTime = calculateReadingTime(form.content || '');

    const payload = {
      ...form,
      readingTime,
    };

    setSaving(true);
    try {
      const res = post
        ? await updateBlog(post.id, payload)
        : await createBlog(payload);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(post ? 'Post updated' : 'Post created');
        router.push('/admin/cms/blog');
      }
    } catch {
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-[#F8FAFC]">Content</h2>
              <Button type="button" variant="outline" size="sm" onClick={generateWithAi} disabled={aiGenerating} loading={aiGenerating}>
                <Sparkles className="h-4 w-4" />
                {aiGenerating ? 'Generating...' : 'Write with AI'}
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={handleTitleChange} placeholder="Enter a compelling blog title" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setField('slug', slugify(e.target.value))} placeholder="auto-generated" />
                </div>
                <div>
                  <Label>Cover Image URL</Label>
                  <Input value={form.coverImage} onChange={(e) => setField('coverImage', e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div>
                <Label>Excerpt</Label>
                <Textarea value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} rows={2} placeholder="Short summary shown in blog listings" />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea value={form.content} onChange={(e) => setField('content', e.target.value)} rows={16} placeholder="Write your blog content here..." className="min-h-[400px] font-mono text-sm leading-relaxed" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-base font-semibold text-[#F8FAFC]">Organization</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Author</Label>
                <Select value={form.authorId} onValueChange={(v) => setField('authorId', v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select author" /></SelectTrigger>
                  <SelectContent>
                    {authors.map((a) => <SelectItem key={a.id} value={a.id}>{a.name || a.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.categoryId} onValueChange={(v) => setField('categoryId', v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Related Service</Label>
                <Select value={form.serviceId} onValueChange={(v) => setField('serviceId', v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>
                    {services.map((s) => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input value={form.tags} onChange={(e) => setField('tags', e.target.value)} placeholder="AI, Automation, ERP" />
              </div>
              <div>
                <Label>Focus Keyword</Label>
                <Input value={form.focusKeyword} onChange={(e) => setField('focusKeyword', e.target.value)} placeholder="primary SEO keyword" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#F8FAFC]">Publishing</h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94A3B8]">Featured</span>
                  <Switch checked={form.isFeatured} onCheckedChange={(c) => setField('isFeatured', c)} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94A3B8]">Published</span>
                  <Switch checked={form.isPublished} onCheckedChange={(c) => setField('isPublished', c)} />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>SEO Title</Label>
                <Input value={form.seoTitle} onChange={(e) => setField('seoTitle', e.target.value)} placeholder="SEO-optimized title" />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Input value={form.metaDescription} onChange={(e) => setField('metaDescription', e.target.value)} placeholder="Meta description for search results" />
              </div>
              <div>
                <Label>Canonical URL</Label>
                <Input value={form.canonicalUrl} onChange={(e) => setField('canonicalUrl', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>OG Title</Label>
                <Input value={form.ogTitle} onChange={(e) => setField('ogTitle', e.target.value)} placeholder="Social sharing title" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/cms/blog')}>Cancel</Button>
          <Button type="submit" disabled={saving} loading={saving}>
            {saving ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </div>
    </form>
  );
}