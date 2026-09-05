import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import InvoicesManager from '@/components/admin/invoices-manager';

export const metadata = {
  title: 'Invoices - AIOpsMedia Admin',
};

export default async function InvoicesPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;

  const search = sp?.search || '';
  const status = sp?.status || '';
  const page = Math.max(1, parseInt(sp?.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp?.pageSize) || 10));

  const where = {};
  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: 'insensitive' } },
      { client: { companyName: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (status) where.status = status;

  const [invoices, total, clients] = await Promise.all([
    db.invoice.findMany({
      where,
      include: {
        client: { select: { id: true, companyName: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.invoice.count({ where }),
    db.client.findMany({
      select: { id: true, companyName: true },
      orderBy: { companyName: 'asc' },
    }),
  ]);

  return (
    <InvoicesManager
      initialInvoices={invoices}
      total={total}
      initialFilters={{ search, status, page, pageSize }}
      clients={clients}
    />
  );
}
