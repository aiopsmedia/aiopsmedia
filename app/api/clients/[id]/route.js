import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { clientSchema } from '@/lib/validations';

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.client.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = clientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const client = await db.client.update({
      where: { id },
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        website: data.website || null,
        industry: data.industry || null,
        notes: data.notes || null,
      },
    });

    try {
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'update',
          resource: 'client',
          resourceId: id,
          metadata: JSON.stringify({ companyName: client.companyName }),
        },
      });
    } catch {}

    return NextResponse.json({ success: true, client });
  } catch {
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.client.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    await db.client.delete({ where: { id } });

    try {
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'delete',
          resource: 'client',
          resourceId: id,
          metadata: JSON.stringify({ companyName: existing.companyName }),
        },
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}