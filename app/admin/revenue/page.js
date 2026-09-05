import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { IndianRupee, Wallet, CheckCircle2, Clock4 } from 'lucide-react';
import { PAYMENT_STATUS_LABELS } from '@/config/constants';

export const metadata = {
  title: 'Revenue - AIOpsMedia Admin',
};

const payVariant = {
  PENDING: 'warning',
  PARTIAL: 'warning',
  PAID: 'success',
  REFUNDED: 'info',
  CANCELLED: 'outline',
};

export default async function RevenuePage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const status = sp?.status || '';

  const where = {};
  if (status) where.status = status;

  const [revenue, totalPaid, pendingAmount] = await Promise.all([
    db.revenue.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        title: true,
        totalAmount: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
        project: { select: { id: true, name: true, slug: true } },
      },
    }),
    db.revenue.aggregate({ _sum: { totalAmount: true }, where: { status: { in: ['PAID', 'PARTIAL'] } } }),
    db.revenue.aggregate({ _sum: { totalAmount: true }, where: { status: 'PENDING' } }),
  ]);

  const paid = Number(totalPaid._sum.totalAmount || 0);
  const pending = Number(pendingAmount._sum.totalAmount || 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Revenue</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Track incoming payments and revenue records.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Records" value={revenue.length} icon={IndianRupee} />
        <StatCard label="Collected" value={formatCurrency(paid)} icon={CheckCircle2} />
        <StatCard label="Outstanding" value={formatCurrency(pending)} icon={Wallet} />
        <StatCard label="Pending Entries" value={revenue.filter((r) => r.status === 'PENDING').length} icon={Clock4} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Records</CardTitle>
          <CardDescription>Recent revenue entries</CardDescription>
        </CardHeader>
        <CardContent>
          {revenue.length === 0 ? (
            <EmptyState title="No revenue recorded" description="Add revenue records to track incoming payments." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)] text-left text-xs uppercase tracking-wider text-[#94A3B8]">
                    <th className="py-3 pr-4 font-medium">Title</th>
                    <th className="py-3 pr-4 font-medium">Project</th>
                    <th className="py-3 pr-4 font-medium">Amount</th>
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.map((r) => (
                    <tr key={r.id} className="border-b border-[rgba(148,163,184,0.08)]">
                      <td className="py-3 pr-4 font-medium text-[#F8FAFC]">{r.title}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{r.project?.name || '—'}</td>
                      <td className="py-3 pr-4 font-semibold text-emerald-400">{formatCurrency(r.totalAmount)}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{formatDate(r.createdAt)}</td>
                      <td className="py-3">
                        <Badge variant={payVariant[r.status]}>{PAYMENT_STATUS_LABELS[r.status]}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
