'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

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

export async function getNavigationItems() {
  const items = await db.navigation.findMany({
    orderBy: { order: 'asc' },
  });
  return items;
}

export async function createNavigationItem(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (!data.label?.trim()) return { error: 'Label is required' };

  try {
    const item = await db.navigation.create({
      data: {
        label: data.label,
        url: data.url || null,
        location: data.location || 'header',
        isExternal: !!data.isExternal,
        order: data.order || 0,
        parentId: data.parentId || null,
        isActive: true,
      },
    });

    await log(user, 'create', 'navigation', item.id, { label: item.label });
    revalidatePath('/admin/cms/navigation');
    return { success: true, id: item.id };
  } catch {
    return { error: 'Failed to create navigation item' };
  }
}

export async function updateNavigationItem(id, data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const item = await db.navigation.update({
      where: { id },
      data: {
        label: data.label,
        url: data.url || null,
        location: data.location || 'header',
        isExternal: !!data.isExternal,
        order: data.order || 0,
        parentId: data.parentId || null,
      },
    });

    await log(user, 'update', 'navigation', item.id, { label: item.label });
    revalidatePath('/admin/cms/navigation');
    return { success: true };
  } catch {
    return { error: 'Failed to update navigation item' };
  }
}

export async function deleteNavigationItem(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const item = await db.navigation.delete({ where: { id } });
    await log(user, 'delete', 'navigation', id, { label: item.label });
    revalidatePath('/admin/cms/navigation');
    return { success: true };
  } catch {
    return { error: 'Failed to delete navigation item' };
  }
}

export async function toggleNavigationItem(id, isActive) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.navigation.update({ where: { id }, data: { isActive } });
    await log(user, 'update', 'navigation', id, { isActive });
    revalidatePath('/admin/cms/navigation');
    return { success: true };
  } catch {
    return { error: 'Failed to toggle navigation item' };
  }
}

export async function reorderNavigationItems(ids) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.$transaction(
      ids.map((id, index) =>
        db.navigation.update({ where: { id }, data: { order: index } })
      )
    );
    revalidatePath('/admin/cms/navigation');
    return { success: true };
  } catch {
    return { error: 'Failed to reorder navigation items' };
  }
}
