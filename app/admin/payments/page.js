import Link from 'next/link';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { CreditCard, CheckCircle2, Clock4, ArrowRight } from 'lucide-react';
import { PAYMENT_STATUS_LABELS } from '@/config/constants';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Payments - AIOpsMedia Admin',
};

const payVariant = {
  PENDING: 'warning',
  PARTIAL: 'warning',
  PAID: 'success',
  REFUNDED: 'info',
  CANCELLED: 'outline',
};

export default async function PaymentsPage() {
  await requireAuth();

  const [invoices, totalReceived, totalOutstanding] = await Promise.all([
    db.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        invoiceNumber: true,
        total: true,
        status: true,
        dueDate: true,
        paidAt: true,
        client: { select: { companyName: true } },
      },
    }),
    db.invoice.aggregate({ _sum: { total: true }, where: { status: 'PAID' } }),
    db.invoice.aggregate({
      _sum: { total: true },
      where: { status: { in: ['PENDING', 'PARTIAL'] } },
    }),
  ]);

  const received = Number(totalReceived._sum.total || 0);
  const outstanding = Number(totalOutstanding._sum.total || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Payments</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Track invoice payments and outstanding balances.</p>
        </div>
        <Button size="sm" asChild><Link href="/admin/invoices">Manage Invoices <ArrowRight className="h-4 w-4" /></Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Invoices" value={invoices.length} icon={CreditCard} />
        <StatCard label="Received" value={formatCurrency(received)} icon={CheckCircle2} />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={Clock4} />
        <StatCard label="Overdue" value={invoices.filter((i) => i.status !== 'PAID' && i.status !== 'CANCELLED' && i.dueDate && new Date(i.dueDate) < new Date()).length} icon={CreditCard} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Payments</CardTitle>
          <CardDescription>Status of all invoice payments</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <EmptyState title="No invoices yet" description="Create invoices to track payments." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)] text-left text-xs uppercase tracking-wider text-[#94A3B8]">
                    <th className="py-3 pr-4 font-medium">Invoice</th>
                    <th className="py-3 pr-4 font-medium">Client</th>
                    <th className="py-3 pr-4 font-medium">Total</th>
                    <th className="py-3 pr-4 font-medium">Due Date</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((i) => (
                    <tr key={i.id} className="border-b border-[rgba(148,163,184,0.08)]">
                      <td className="py-3 pr-4">
                        <Link href={`/admin/invoices/${i.id}`} className="font-medium text-[#22D3EE] hover:underline">
                          {i.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{i.client?.companyName || '—'}</td>
                      <td className="py-3 pr-4 font-semibold text-[#F8FAFC]">{formatCurrency(i.total)}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{i.dueDate ? formatDate(i.dueDate) : '—'}</td>
                      <td className="py-3">
                        <Badge variant={payVariant[i.status]}>{PAYMENT_STATUS_LABELS[i.status]}</Badge>
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
