import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const client = await db.client.findUnique({
      where: { id },
      include: {
        projects: {
          select: { id: true, name: true, status: true, budget: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        },
        quotations: {
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          select: { id: true, title: true, type: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const totalBilled = client.invoices.reduce((s, inv) => s + Number(inv.total || 0), 0);
    const totalPaid = client.invoices
      .filter((inv) => inv.status === 'PAID')
      .reduce((s, inv) => s + Number(inv.total || 0), 0);

    return NextResponse.json({
      client: {
        ...client,
        totalBilled,
        totalPaid,
        outstanding: totalBilled - totalPaid,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load client details' }, { status: 500 });
  }
}