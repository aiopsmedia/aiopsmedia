'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { leadSchema } from '@/lib/validations';
import z from 'zod';

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

function parseLeadData(data) {
  const parsed = z.object({
    name: z.string().min(1, 'Name is required'),
    company: z.string().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    whatsapp: z.string().optional().or(z.literal('')),
    website: z.string().optional().or(z.literal('')),
    industry: z.string().optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    service: z.string().optional().or(z.literal('')),
    source: z.string(),
    budget: z.string().optional().or(z.literal('')),
    status: z.string(),
    priority: z.string(),
    notes: z.string().optional().or(z.literal('')),
    followUpDate: z.string().optional().or(z.literal('')),
    assignedToId: z.string().optional().or(z.literal('')),
  }).safeParse(data);

  if (!parsed.success) {
    return { error: 'Invalid data provided' };
  }

  return { data: parsed.data };
}

export async function createLead(input) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const result = parseLeadData(input);
  if (result.error) return result;

  const d = result.data;

  try {
    const lead = await db.lead.create({
      data: {
        name: d.name,
        company: d.company || null,
        email: d.email || null,
        phone: d.phone || null,
        whatsapp: d.whatsapp || null,
        website: d.website || null,
        industry: d.industry || null,
        location: d.location || null,
        service: d.service || null,
        source: d.source,
        budget: d.budget || null,
        status: d.status,
        priority: d.priority,
        notes: d.notes || null,
        followUpDate: d.followUpDate ? new Date(d.followUpDate) : null,
        assignedToId: d.assignedToId || null,
        createdById: user.id,
      },
    });

    await log(user, 'create', 'lead', lead.id, { name: lead.name });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    return { success: true, id: lead.id };
  } catch {
    return { error: 'Failed to create lead' };
  }
}

export async function updateLead(id, input) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const result = parseLeadData(input);
  if (result.error) return result;

  const d = result.data;

  try {
    const lead = await db.lead.update({
      where: { id },
      data: {
        name: d.name,
        company: d.company || null,
        email: d.email || null,
        phone: d.phone || null,
        whatsapp: d.whatsapp || null,
        website: d.website || null,
        industry: d.industry || null,
        location: d.location || null,
        service: d.service || null,
        source: d.source,
        budget: d.budget || null,
        status: d.status,
        priority: d.priority,
        notes: d.notes || null,
        followUpDate: d.followUpDate ? new Date(d.followUpDate) : null,
        assignedToId: d.assignedToId || null,
      },
    });

    await log(user, 'update', 'lead', lead.id, { name: lead.name });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    return { success: true, id: lead.id };
  } catch {
    return { error: 'Failed to update lead' };
  }
}

export async function deleteLead(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const lead = await db.lead.findUnique({ where: { id } });
    if (!lead) return { error: 'Lead not found' };

    await db.lead.delete({ where: { id } });

    await log(user, 'delete', 'lead', id, { name: lead.name });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    return { success: true };
  } catch {
    return { error: 'Failed to delete lead' };
  }
}

export async function updateLeadStatus(id, status) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const lead = await db.lead.update({
      where: { id },
      data: { status },
    });

    await log(user, 'update', 'lead', id, { status });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    return { success: true };
  } catch {
    return { error: 'Failed to update lead status' };
  }
}

export async function assignLead(id, userId) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const lead = await db.lead.update({
      where: { id },
      data: { assignedToId: userId || null },
    });

    await log(user, 'update', 'lead', id, { assignedToId: userId });

    revalidatePath('/admin/leads');
    return { success: true };
  } catch {
    return { error: 'Failed to assign lead' };
  }
}

export async function addLeadActivity(leadId, type, title, notes) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const activity = await db.leadActivity.create({
      data: {
        leadId,
        userId: user.id,
        type,
        title,
        notes: notes || null,
      },
    });

    await log(user, 'create', 'leadActivity', activity.id, { leadId, type, title });

    revalidatePath('/admin/leads');
    return { success: true, id: activity.id };
  } catch {
    return { error: 'Failed to add activity' };
  }
}

export async function bulkUpdateLeads(ids, data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  if (!Array.isArray(ids) || ids.length === 0) {
    return { error: 'No leads selected' };
  }

  const update = {};
  if (data?.status) update.status = data.status;
  if (data?.priority) update.priority = data.priority;
  if (data?.assignedToId) update.assignedToId = data.assignedToId;

  if (Object.keys(update).length === 0) {
    return { error: 'No updates provided' };
  }

  try {
    const result = await db.lead.updateMany({
      where: { id: { in: ids } },
      data: update,
    });

    await log(user, 'update', 'lead', ids.join(','), { action: 'bulk', ...update });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    return { success: true, count: result.count };
  } catch {
    return { error: 'Failed to update leads' };
  }
}

export async function exportLeadsCsv() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { name: true } } },
    });

    const headers = [
      'Name', 'Company', 'Email', 'Phone', 'Source', 'Status',
      'Priority', 'Assigned To', 'Created At',
    ];

    const rows = leads.map((l) => [
      l.name,
      l.company || '',
      l.email || '',
      l.phone || '',
      l.source,
      l.status,
      l.priority,
      l.assignedTo?.name || '',
      new Date(l.createdAt).toLocaleDateString('en-IN'),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');

    return { success: true, csv };
  } catch {
    return { error: 'Failed to export leads' };
  }
}
