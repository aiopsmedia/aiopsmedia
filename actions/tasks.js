'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function updateTaskStatus(taskId, status) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const valid = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
  if (!valid.includes(status)) return { error: 'Invalid status' };

  try {
    const task = await db.task.update({
      where: { id: taskId },
      data: { status },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'update',
        resource: 'task',
        resourceId: taskId,
        metadata: JSON.stringify({ status, title: task.title }),
      },
    });

    revalidatePath(`/admin/projects/${task.projectId}`);
    return { success: true };
  } catch (err) {
    return { error: 'Failed to update task' };
  }
}

export async function createTask(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  if (!data.title) return { error: 'Title is required' };

  try {
    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        projectId: data.projectId,
        assigneeId: data.assigneeId || null,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        estimatedHours: data.estimatedHours ?? null,
        createdById: user.id,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'create',
        resource: 'task',
        resourceId: task.id,
        metadata: JSON.stringify({ title: task.title }),
      },
    });

    revalidatePath(`/admin/projects/${data.projectId}`);
    return { success: true, id: task.id };
  } catch (err) {
    return { error: 'Failed to create task' };
  }
}
