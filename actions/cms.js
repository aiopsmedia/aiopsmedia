'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { slugify, calculateReadingTime } from '@/lib/utils';

async function log(user, action, resource, resourceId, metadata = {}) {
  try {
    await db.auditLog.create({
      data: {
        userId: user.id,
        action,
        resource,
        resourceId,
        metadata: JSON.stringify(metadata),
      },
    });
  } catch {}
}

// ─── Services ──────────────────────────────────────────

export async function createService(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.title?.trim()) return { error: 'Title is required' };
  const slug = data.slug || slugify(data.title);

  try {
    const service = await db.service.create({
      data: {
        title: data.title,
        slug,
        icon: data.icon || null,
        description: data.description || null,
        ctaText: data.ctaText || 'Get a Free Consultation',
        order: data.order || 0,
      },
    });
    await log(user, 'create', 'service', service.id, { title: service.title });
    revalidatePath('/admin/cms/services');
    return { success: true };
  } catch (err) {
    if (err?.code === 'P2002') return { error: 'A service with this slug already exists' };
    return { error: 'Failed to create service' };
  }
}

export async function updateService(id, data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.title?.trim()) return { error: 'Title is required' };

  try {
    const service = await db.service.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug || slugify(data.title),
        icon: data.icon || null,
        description: data.description || null,
        ctaText: data.ctaText || 'Get a Free Consultation',
      },
    });
    await log(user, 'update', 'service', service.id, { title: service.title });
    revalidatePath('/admin/cms/services');
    return { success: true };
  } catch (err) {
    if (err?.code === 'P2002') return { error: 'A service with this slug already exists' };
    return { error: 'Failed to update service' };
  }
}

export async function deleteService(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const service = await db.service.delete({ where: { id } });
    await log(user, 'delete', 'service', id, { title: service.title });
    revalidatePath('/admin/cms/services');
    return { success: true };
  } catch {
    return { error: 'Failed to delete service' };
  }
}

export async function toggleService(id, isActive) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.service.update({ where: { id }, data: { isActive } });
    await log(user, 'update', 'service', id, { isActive });
    revalidatePath('/admin/cms/services');
    return { success: true };
  } catch {
    return { error: 'Failed to update service' };
  }
}

export async function reorderServices(ids) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.$transaction(
      ids.map((id, index) =>
        db.service.update({ where: { id }, data: { order: index } })
      )
    );
    await log(user, 'update', 'service', ids.join(','), { reorder: true });
    revalidatePath('/admin/cms/services');
    return { success: true };
  } catch {
    return { error: 'Failed to reorder services' };
  }
}

// ─── Products ──────────────────────────────────────────

export async function createProduct(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.title?.trim()) return { error: 'Title is required' };

  try {
    const product = await db.product.create({
      data: {
        title: data.title,
        slug: data.slug || slugify(data.title),
        serviceId: data.serviceId || null,
        shortDescription: data.shortDescription || null,
        description: data.description || null,
        price: data.price != null ? Number(data.price) : null,
        originalPrice: data.originalPrice != null ? Number(data.originalPrice) : null,
        image: data.image || null,
        category: data.category || null,
        ctaText: data.ctaText || 'Request Demo',
        order: data.order || 0,
      },
    });
    await log(user, 'create', 'product', product.id, { title: product.title });
    revalidatePath('/admin/cms/products');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to create product' };
  }
}

export async function updateProduct(id, data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const product = await db.product.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug || slugify(data.title),
        serviceId: data.serviceId || null,
        shortDescription: data.shortDescription || null,
        description: data.description || null,
        price: data.price != null ? Number(data.price) : null,
        originalPrice: data.originalPrice != null ? Number(data.originalPrice) : null,
        image: data.image || null,
        category: data.category || null,
        ctaText: data.ctaText || 'Request Demo',
      },
    });
    await log(user, 'update', 'product', product.id, { title: product.title });
    revalidatePath('/admin/cms/products');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to update product' };
  }
}

export async function deleteProduct(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const product = await db.product.delete({ where: { id } });
    await log(user, 'delete', 'product', id, { title: product.title });
    revalidatePath('/admin/cms/products');
    return { success: true };
  } catch {
    return { error: 'Failed to delete product' };
  }
}

export async function toggleProduct(id, isActive) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.product.update({ where: { id }, data: { isActive } });
    await log(user, 'update', 'product', id, { isActive });
    revalidatePath('/admin/cms/products');
    return { success: true };
  } catch {
    return { error: 'Failed to update product' };
  }
}

// ─── Testimonials ──────────────────────────────────────

export async function createTestimonial(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.clientName?.trim() || !data.content?.trim()) return { error: 'Client name and content are required' };

  try {
    const t = await db.testimonial.create({
      data: {
        clientName: data.clientName,
        company: data.company || null,
        designation: data.designation || null,
        content: data.content,
        rating: data.rating ? Number(data.rating) : null,
        image: data.image || null,
        isDemo: !!data.isDemo,
        order: data.order || 0,
      },
    });
    await log(user, 'create', 'testimonial', t.id, { clientName: t.clientName });
    revalidatePath('/admin/cms/testimonials');
    return { success: true };
  } catch {
    return { error: 'Failed to create testimonial' };
  }
}

export async function updateTestimonial(id, data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const t = await db.testimonial.update({
      where: { id },
      data: {
        clientName: data.clientName,
        company: data.company || null,
        designation: data.designation || null,
        content: data.content,
        rating: data.rating ? Number(data.rating) : null,
        image: data.image || null,
        isDemo: !!data.isDemo,
      },
    });
    await log(user, 'update', 'testimonial', id, { clientName: t.clientName });
    revalidatePath('/admin/cms/testimonials');
    return { success: true };
  } catch {
    return { error: 'Failed to update testimonial' };
  }
}

export async function deleteTestimonial(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.testimonial.delete({ where: { id } });
    await log(user, 'delete', 'testimonial', id);
    revalidatePath('/admin/cms/testimonials');
    return { success: true };
  } catch {
    return { error: 'Failed to delete testimonial' };
  }
}

export async function toggleTestimonial(id, field, value) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.testimonial.update({ where: { id }, data: { [field]: !!value } });
    await log(user, 'update', 'testimonial', id, { [field]: !!value });
    revalidatePath('/admin/cms/testimonials');
    return { success: true };
  } catch {
    return { error: 'Failed to update testimonial' };
  }
}

export async function reorderTestimonials(ids) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.$transaction(
      ids.map((id, index) =>
        db.testimonial.update({ where: { id }, data: { order: index } })
      )
    );
    revalidatePath('/admin/cms/testimonials');
    return { success: true };
  } catch {
    return { error: 'Failed to reorder' };
  }
}

// ─── FAQs ──────────────────────────────────────────────

export async function createFaq(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.question?.trim() || !data.answer?.trim()) return { error: 'Question and answer are required' };

  try {
    const faq = await db.faq.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category || null,
        order: data.order || 0,
      },
    });
    await log(user, 'create', 'faq', faq.id, { question: faq.question });
    revalidatePath('/admin/cms/faqs');
    return { success: true };
  } catch {
    return { error: 'Failed to create FAQ' };
  }
}

export async function updateFaq(id, data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.faq.update({
      where: { id },
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category || null,
      },
    });
    await log(user, 'update', 'faq', id);
    revalidatePath('/admin/cms/faqs');
    return { success: true };
  } catch {
    return { error: 'Failed to update FAQ' };
  }
}

export async function deleteFaq(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.faq.delete({ where: { id } });
    await log(user, 'delete', 'faq', id);
    revalidatePath('/admin/cms/faqs');
    return { success: true };
  } catch {
    return { error: 'Failed to delete FAQ' };
  }
}

export async function toggleFaq(id, isActive) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.faq.update({ where: { id }, data: { isActive } });
    await log(user, 'update', 'faq', id, { isActive });
    revalidatePath('/admin/cms/faqs');
    return { success: true };
  } catch {
    return { error: 'Failed to update FAQ' };
  }
}

export async function reorderFaqs(ids) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.$transaction(
      ids.map((id, index) =>
        db.faq.update({ where: { id }, data: { order: index } })
      )
    );
    revalidatePath('/admin/cms/faqs');
    return { success: true };
  } catch {
    return { error: 'Failed to reorder' };
  }
}

// ─── Blog ──────────────────────────────────────────────

export async function toggleBlogPublished(id, isPublished) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const data = { isPublished };
    if (isPublished && !(await db.blog.findUnique({ where: { id } })).publishedAt) {
      data.publishedAt = new Date();
    }
    if (!isPublished) data.publishedAt = null;
    await db.blog.update({ where: { id }, data });
    await log(user, 'update', 'blog', id, { isPublished });
    revalidatePath('/admin/cms/blog');
    return { success: true };
  } catch {
    return { error: 'Failed to update blog' };
  }
}

export async function toggleBlogFeatured(id, isFeatured) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.blog.update({ where: { id }, data: { isFeatured } });
    revalidatePath('/admin/cms/blog');
    return { success: true };
  } catch {
    return { error: 'Failed to update blog' };
  }
}

export async function deleteBlog(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.blog.delete({ where: { id } });
    await log(user, 'delete', 'blog', id);
    revalidatePath('/admin/cms/blog');
    return { success: true };
  } catch {
    return { error: 'Failed to delete blog' };
  }
}

export async function createBlog(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.title?.trim()) return { error: 'Title is required' };

  try {
    const slug = data.slug || slugify(data.title);

    const blog = await db.blog.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content || null,
        coverImage: data.coverImage || null,
        authorId: data.authorId || user.id,
        categoryId: data.categoryId || null,
        serviceId: data.serviceId || null,
        tags: data.tags || null,
        seoTitle: data.seoTitle || null,
        metaDescription: data.metaDescription || null,
        focusKeyword: data.focusKeyword || null,
        canonicalUrl: data.canonicalUrl || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImage: data.ogImage || null,
        isPublished: !!data.isPublished,
        isFeatured: !!data.isFeatured,
        publishedAt: data.isPublished ? new Date() : null,
        readingTime: calculateReadingTime(data.content || ''),
      },
    });
    await log(user, 'create', 'blog', blog.id, { title: blog.title });
    revalidatePath('/admin/cms/blog');
    revalidatePath('/blog');
    return { success: true, id: blog.id };
  } catch (err) {
    if (err?.code === 'P2002') return { error: 'A blog post with this slug already exists' };
    return { error: 'Failed to create blog post' };
  }
}

export async function updateBlog(id, data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.title?.trim()) return { error: 'Title is required' };

  try {
    const existing = await db.blog.findUnique({ where: { id } });
    if (!existing) return { error: 'Blog post not found' };

    const isPublishing = !!data.isPublished && !existing.isPublished;

    const blog = await db.blog.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug || slugify(data.title),
        excerpt: data.excerpt || null,
        content: data.content || null,
        coverImage: data.coverImage || null,
        authorId: data.authorId || existing.authorId,
        categoryId: data.categoryId || null,
        serviceId: data.serviceId || null,
        tags: data.tags || null,
        seoTitle: data.seoTitle || null,
        metaDescription: data.metaDescription || null,
        focusKeyword: data.focusKeyword || null,
        canonicalUrl: data.canonicalUrl || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImage: data.ogImage || null,
        isPublished: !!data.isPublished,
        isFeatured: !!data.isFeatured,
        publishedAt: isPublishing ? new Date() : data.isPublished ? existing.publishedAt : null,
        readingTime: calculateReadingTime(data.content || existing.content || ''),
      },
    });
    await log(user, 'update', 'blog', id, { title: blog.title });
    revalidatePath('/admin/cms/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);
    return { success: true, id: blog.id };
  } catch (err) {
    if (err?.code === 'P2002') return { error: 'A blog post with this slug already exists' };
    return { error: 'Failed to update blog post' };
  }
}

// ─── Site Settings ─────────────────────────────────────

export async function saveSiteSettings(group, entries) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.$transaction(
      Object.entries(entries).map(([key, value]) =>
        db.siteSetting.upsert({
          where: { key: `${group}.${key}` },
          update: { value: String(value ?? '') },
          create: { key: `${group}.${key}`, value: String(value ?? ''), group },
        })
      )
    );
    await log(user, 'update', 'siteSetting', group, { count: Object.keys(entries).length });
    revalidatePath('/admin/cms/settings');
    return { success: true };
  } catch {
    return { error: 'Failed to save settings' };
  }
}
