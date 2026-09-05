'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { slugify } from '@/lib/utils';
import { projectSchema } from '@/lib/validations';

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

export async function createProject(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || 'Invalid project data' };
  }

  const d = parsed.data;
  const slug = d.slug || slugify(d.name);

  try {
    const project = await db.project.create({
      data: {
        name: d.name,
        slug,
        description: d.description || null,
        clientId: d.clientId || null,
        managerId: d.managerId || null,
        startDate: d.startDate ? new Date(d.startDate) : null,
        deadline: d.deadline ? new Date(d.deadline) : null,
        status: d.status,
        priority: d.priority,
        budget: d.budget ?? null,
        revenue: d.revenue ?? null,
        paymentStatus: d.paymentStatus,
        progress: d.progress ?? 0,
      },
    });

    await log(user, 'create', 'project', project.id, { name: project.name });

    revalidatePath('/admin/projects');
    revalidatePath('/admin');
    return { success: true, id: project.id };
  } catch (err) {
    if (err?.code === 'P2002') return { error: 'A project with this slug already exists' };
    return { error: 'Failed to create project' };
  }
}

export async function updateProject(id, data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || 'Invalid project data' };
  }

  const d = parsed.data;

  try {
    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) return { error: 'Project not found' };

    const project = await db.project.update({
      where: { id },
      data: {
        name: d.name,
        slug: d.slug || slugify(d.name),
        description: d.description || null,
        clientId: d.clientId || null,
        managerId: d.managerId || null,
        startDate: d.startDate ? new Date(d.startDate) : null,
        deadline: d.deadline ? new Date(d.deadline) : null,
        status: d.status,
        priority: d.priority,
        budget: d.budget ?? null,
        revenue: d.revenue ?? null,
        paymentStatus: d.paymentStatus,
        progress: d.progress ?? 0,
      },
    });

    await log(user, 'update', 'project', id, { name: project.name });

    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath('/admin');
    return { success: true, id: project.id };
  } catch (err) {
    if (err?.code === 'P2002') return { error: 'A project with this slug already exists' };
    return { error: 'Failed to update project' };
  }
}

export async function deleteProject(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const project = await db.project.findUnique({ where: { id } });
    if (!project) return { error: 'Project not found' };

    await db.project.delete({ where: { id } });
    await log(user, 'delete', 'project', id, { name: project.name });

    revalidatePath('/admin/projects');
    revalidatePath('/admin');
    return { success: true };
  } catch {
    return { error: 'Failed to delete project' };
  }
}

export async function addProjectMember(projectId, userId, role) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    if (role === 'manager') {
      await db.project.update({ where: { id: projectId }, data: { managerId: userId } });
    }

    const member = await db.projectMember.upsert({
      where: {
        projectId_userId: { projectId, userId },
      },
      update: { role: role || 'member' },
      create: { projectId, userId, role: role || 'member' },
    });

    await log(user, 'create', 'projectMember', member.id, { projectId, userId });
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true };
  } catch {
    return { error: 'Failed to add member' };
  }
}

export async function removeProjectMember(projectId, userId) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await db.projectMember.deleteMany({ where: { projectId, userId } });
    await log(user, 'delete', 'projectMember', projectId, { projectId, userId });
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true };
  } catch {
    return { error: 'Failed to remove member' };
  }
}