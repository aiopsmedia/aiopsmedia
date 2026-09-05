import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { TrendingDown, Receipt, Coffee, Cloud } from 'lucide-react';
import { EXPENSE_CATEGORY_LABELS } from '@/config/constants';

export const metadata = {
  title: 'Expenses - AIOpsMedia Admin',
};

export default async function ExpensesPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const category = sp?.category || '';
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const where = {};
  if (category) where.category = category;
  if (sp?.all !== '1') where.date = { gte: startOfYear };

  const [expenses, yearTotal, monthTotal, categories] = await Promise.all([
    db.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        project: { select: { id: true, name: true, slug: true } },
        employee: { select: { id: true, name: true } },
      },
      take: 100,
    }),
    db.expense.aggregate({ _sum: { amount: true }, where: { date: { gte: startOfYear } } }),
    db.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
    }),
    db.expense.groupBy({
      by: ['category'],
      _sum: { amount: true },
      where: { date: { gte: startOfYear } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Expenses</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Track business expenses by category.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Records" value={expenses.length} icon={Receipt} />
        <StatCard label="This Year" value={formatCurrency(Number(yearTotal._sum.amount || 0))} icon={TrendingDown} />
        <StatCard label="This Month" value={formatCurrency(Number(monthTotal._sum.amount || 0))} icon={Coffee} />
        <StatCard label="Categories" value={categories.length} icon={Cloud} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expense Records</CardTitle>
          <CardDescription>
            Total: {formatCurrency(expenses.reduce((sum, e) => sum + Number(e.amount), 0))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <EmptyState title="No expenses recorded" description="Add expenses to track your business spending." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)] text-left text-xs uppercase tracking-wider text-[#94A3B8]">
                    <th className="py-3 pr-4 font-medium">Title</th>
                    <th className="py-3 pr-4 font-medium">Category</th>
                    <th className="py-3 pr-4 font-medium">Project</th>
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => (
                    <tr key={e.id} className="border-b border-[rgba(148,163,184,0.08)]">
                      <td className="py-3 pr-4 font-medium text-[#F8FAFC]">{e.title}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{EXPENSE_CATEGORY_LABELS[e.category]}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{e.project?.name || '—'}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{formatDate(e.date)}</td>
                      <td className="py-3 font-semibold text-red-400">{formatCurrency(e.amount)}</td>
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
