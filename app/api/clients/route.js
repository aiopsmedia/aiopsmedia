import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { clientSchema } from '@/lib/validations';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const client = await db.client.create({
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        website: data.website || null,
        industry: data.industry || null,
        notes: data.notes || null,
        leadId: data.leadId || null,
      },
    });

    try {
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'create',
          resource: 'client',
          resourceId: client.id,
          metadata: JSON.stringify({ companyName: client.companyName }),
        },
      });
    } catch {}

    return NextResponse.json({ success: true, client });
  } catch (err) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'A client with this lead link already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clients = await db.client.findMany({
      select: { id: true, companyName: true, contactPerson: true, email: true, phone: true },
      orderBy: { companyName: 'asc' },
    });

    return NextResponse.json({ clients });
  } catch {
    return NextResponse.json({ error: 'Failed to load clients' }, { status: 500 });
  }
}