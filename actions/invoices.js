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

function generateInvoiceNumber(last) {
  const n = (last || 0) + 1;
  return `INV-${new Date().getFullYear()}-${String(n).padStart(4, '0')}`;
}

export async function getNextInvoiceNumber() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const last = await db.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true },
    });

    let counter = 0;
    if (last) {
      const match = last.invoiceNumber.match(/(\d+)\s*$/);
      counter = match ? parseInt(match[1]) : 0;
    }

    return { success: true, invoiceNumber: generateInvoiceNumber(counter) };
  } catch {
    return { error: 'Failed to generate invoice number' };
  }
}

export async function createInvoice(data) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  if (!data.clientId) return { error: 'Client is required' };
  if (!Array.isArray(data.items) || data.items.length === 0) return { error: 'At least one item is required' };

  try {
    const last = await db.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true },
    });

    let counter = 0;
    if (last) {
      const match = last.invoiceNumber.match(/(\d+)\s*$/);
      counter = match ? parseInt(match[1]) : 0;
    }

    const invoiceNumber = data.invoiceNumber || generateInvoiceNumber(counter);

    const subtotal = data.items.reduce((s, it) => s + Number(it.quantity) * Number(it.rate), 0);
    const discount = Number(data.discount || 0);
    const taxable = subtotal - discount;
    const taxRate = Number(data.taxRate ?? 18);
    const taxAmount = (taxable * taxRate) / 100;
    const total = taxable + taxAmount;

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        clientId: data.clientId,
        projectId: data.projectId || null,
        subtotal,
        discount,
        taxRate,
        taxAmount,
        total,
        status: data.status || 'PENDING',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        notes: data.notes || null,
        terms: data.terms || null,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            amount: Number(item.quantity) * Number(item.rate),
          })),
        },
      },
      include: { items: true },
    });

    await log(user, 'create', 'invoice', invoice.id, { invoiceNumber: invoice.invoiceNumber, total });

    revalidatePath('/admin/invoices');
    if (data.projectId) revalidatePath(`/admin/projects/${data.projectId}`);
    revalidatePath('/admin');
    return { success: true, id: invoice.id };
  } catch (err) {
    if (err?.code === 'P2002') return { error: 'This invoice number already exists' };
    return { error: err?.message || 'Failed to create invoice' };
  }
}

export async function updateInvoiceStatus(id, status) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const valid = ['PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'CANCELLED'];
  if (!valid.includes(status)) return { error: 'Invalid status' };

  try {
    const data = { status };
    if (status === 'PAID') data.paidAt = new Date();

    const invoice = await db.invoice.update({
      where: { id },
      data,
    });

    await log(user, 'update', 'invoice', id, { status });

    revalidatePath('/admin/invoices');
    revalidatePath(`/admin/invoices/${id}`);
    return { success: true };
  } catch {
    return { error: 'Failed to update invoice' };
  }
}

export async function deleteInvoice(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const invoice = await db.invoice.findUnique({ where: { id } });
    if (!invoice) return { error: 'Invoice not found' };

    await db.invoice.delete({ where: { id } });
    await log(user, 'delete', 'invoice', id, { invoiceNumber: invoice.invoiceNumber });

    revalidatePath('/admin/invoices');
    return { success: true };
  } catch {
    return { error: 'Failed to delete invoice' };
  }
}