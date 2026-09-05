import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import QuotationsManager from '@/components/admin/quotations-manager';

export const metadata = {
  title: 'Quotations - AIOpsMedia Admin',
};

export default async function QuotationsPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;

  const search = sp?.search || '';
  const status = sp?.status || '';
  const page = Math.max(1, parseInt(sp?.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp?.pageSize) || 10));

  const where = {};
  if (search) {
    where.OR = [
      { quotationNumber: { contains: search, mode: 'insensitive' } },
      { client: { companyName: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (status) where.status = status;

  const [quotations, total] = await Promise.all([
    db.quotation.findMany({
      where,
      include: {
        client: { select: { id: true, companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.quotation.count({ where }),
  ]);

  return (
    <QuotationsManager
      initialQuotations={quotations}
      total={total}
      initialFilters={{ search, status, page, pageSize }}
    />
  );
}
