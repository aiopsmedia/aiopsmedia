'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { slugify } from '@/lib/utils';

const FIELD_TYPES = ['text', 'email', 'textarea', 'select', 'number', 'tel', 'date', 'checkbox'];

function normalizeFields(fields) {
  if (!Array.isArray(fields)) return [];
  return fields
    .filter((f) => f && typeof f === 'object' && f.label?.trim())
    .map((f, i) => ({
      key: String(f.key || `field_${i + 1}`).trim(),
      label: String(f.label).trim(),
      type: FIELD_TYPES.includes(f.type) ? f.type : 'text',
      required: Boolean(f.required),
      placeholder: f.placeholder ? String(f.placeholder) : '',
      options: Array.isArray(f.options)
        ? f.options.map((o) => String(o).trim()).filter(Boolean)
        : typeof f.options === 'string'
          ? f.options.split(',').map((o) => o.trim()).filter(Boolean)
          : [],
    }));
}

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

export async function createForm(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.name?.trim()) return { error: 'Form name is required' };

  const fields = normalizeFields(data.fields);
  if (fields.length === 0) return { error: 'Add at least one field to the form' };

  const slug = data.slug || slugify(data.name);

  try {
    const form = await db.form.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description?.trim() || null,
        fields,
        successMessage: data.successMessage?.trim() || 'Thanks! Your submission has been received.',
        redirectUrl: data.redirectUrl?.trim() || null,
        isActive: data.isActive !== false,
      },
    });
    await log(user, 'create', 'form', form.id, { name: form.name });
    revalidatePath('/admin/forms');
    return { success: true, id: form.id };
  } catch (err) {
    if (err?.code === 'P2002') return { error: 'A form with this slug already exists' };
    console.error('[forms] create error:', err);
    return { error: 'Failed to create form' };
  }
}

export async function updateForm(id, data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.name?.trim()) return { error: 'Form name is required' };

  const fields = normalizeFields(data.fields);
  if (fields.length === 0) return { error: 'Add at least one field to the form' };

  try {
    const form = await db.form.update({
      where: { id },
      data: {
        name: data.name.trim(),
        slug: data.slug || slugify(data.name),
        description: data.description?.trim() || null,
        fields,
        successMessage: data.successMessage?.trim() || 'Thanks! Your submission has been received.',
        redirectUrl: data.redirectUrl?.trim() || null,
        isActive: data.isActive !== false,
      },
    });
    await log(user, 'update', 'form', form.id, { name: form.name });
    revalidatePath('/admin/forms');
    revalidatePath(`/forms/${form.slug}`);
    return { success: true };
  } catch (err) {
    if (err?.code === 'P2002') return { error: 'A form with this slug already exists' };
    console.error('[forms] update error:', err);
    return { error: 'Failed to update form' };
  }
}

export async function deleteForm(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const form = await db.form.delete({ where: { id } });
    await log(user, 'delete', 'form', form.id, { name: form.name });
    revalidatePath('/admin/forms');
    revalidatePath(`/forms/${form.slug}`);
    return { success: true };
  } catch (err) {
    console.error('[forms] delete error:', err);
    return { error: 'Failed to delete form' };
  }
}

export async function toggleForm(id, active) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const form = await db.form.update({
      where: { id },
      data: { isActive: Boolean(active) },
      select: { id: true, name: true, slug: true },
    });
    await log(user, 'toggle', 'form', form.id, { isActive: active });
    revalidatePath('/admin/forms');
    revalidatePath(`/forms/${form.slug}`);
    return { success: true };
  } catch (err) {
    console.error('[forms] toggle error:', err);
    return { error: 'Failed to update form' };
  }
}

export async function deleteSubmission(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.formSubmission.delete({ where: { id } });
    await log(user, 'delete', 'form-submission', id);
    revalidatePath('/admin/forms');
    return { success: true };
  } catch (err) {
    console.error('[forms] delete submission error:', err);
    return { error: 'Failed to delete submission' };
  }
}