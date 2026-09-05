'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function markNotificationRead(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.notification.update({
      where: { id, userId: user.id },
      data: { isRead: true },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/notifications');
    return { success: true };
  } catch {
    return { error: 'Failed to mark notification as read' };
  }
}

export async function markAllNotificationsRead() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/notifications');
    return { success: true };
  } catch {
    return { error: 'Failed to mark all notifications as read' };
  }
}
