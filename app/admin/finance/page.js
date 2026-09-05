import Link from 'next/link';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ChartCard, RevenueLineChart } from '@/components/admin/dashboard-charts';
import { IndianRupee, TrendingDown, PiggyBank, Wallet, ArrowRight } from 'lucide-react';
import { PAYMENT_STATUS_LABELS, EXPENSE_CATEGORY_LABELS } from '@/config/constants';

export const metadata = {
  title: 'Finance - AIOpsMedia Admin',
};

const payVariant = {
  PENDING: 'warning',
  PARTIAL: 'warning',
  PAID: 'success',
  REFUNDED: 'info',
  CANCELLED: 'outline',
};

export default async function FinancePage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const yearFilter = sp?.year || 'this';

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [revenueAgg, expenseAgg, pendingRevenue, recentRevenue, recentExpenses, monthlyExpenses] = await Promise.all([
    db.revenue.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['PAID', 'PARTIAL'] } },
    }),
    db.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: startOfYear } },
    }),
    db.revenue.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'PENDING' },
    }),
    db.revenue.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, title: true, totalAmount: true, status: true, createdAt: true },
    }),
    db.expense.findMany({
      orderBy: { date: 'desc' },
      take: 8,
    }),
    db.expense.findMany({
      where: { date: { gte: startOfYear } },
      select: { amount: true, date: true },
    }),
  ]);

  const totalRevenue = Number(revenueAgg._sum.totalAmount || 0);
  const totalExpenses = Number(expenseAgg._sum.amount || 0);
  const netProfit = totalRevenue - totalExpenses;
  const outstanding = Number(pendingRevenue._sum.totalAmount || 0);

  const monthlyExpenseMap = {};
  monthlyExpenses.forEach((row) => {
    const key = new Date(row.date).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    monthlyExpenseMap[key] = (monthlyExpenseMap[key] || 0) + Number(row.amount);
  });

  const monthLabels = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthLabels.push(d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }));
  }
  // Monthly trend uses expenses only on finance; we'll build revenue trend from revenue records
  const recentMonthRevenue = await db.revenue.findMany({
    where: { createdAt: { gte: startOfYear } },
    select: { totalAmount: true, createdAt: true },
  });
  const monthlyRevenueMap = {};
  recentMonthRevenue.forEach((row) => {
    const key = new Date(row.createdAt).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + Number(row.totalAmount);
  });

  const monthlyData = monthLabels.map((m) => ({
    month: m,
    revenue: monthlyRevenueMap[m] || 0,
    expenses: monthlyExpenseMap[m] || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Finance Overview</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Track revenue, expenses, and profitability across your business.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild><Link href="/admin/revenue">Revenue</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href="/admin/expenses">Expenses</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href="/admin/budgets">Budgets</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href="/admin/invoices">Invoices</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={IndianRupee} />
        <StatCard label="Total Expenses" value={formatCurrency(totalExpenses)} icon={TrendingDown} />
        <StatCard label="Net Profit" value={formatCurrency(netProfit)} icon={PiggyBank} />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={Wallet} />
      </div>

      <ChartCard title="Monthly Trend" description="Revenue vs expenses (this year)">
        <RevenueLineChart data={monthlyData} />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Revenue</CardTitle>
              <CardDescription>Latest incoming payments</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild><Link href="/admin/revenue">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent>
            {recentRevenue.length === 0 ? (
              <EmptyState title="No revenue recorded" />
            ) : (
              <div className="space-y-3">
                {recentRevenue.map((rev) => (
                  <div key={rev.id} className="flex items-center justify-between rounded-lg border border-[rgba(148,163,184,0.1)] p-3">
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]">{rev.title}</p>
                      <p className="text-xs text-[#94A3B8]">{formatDate(rev.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-emerald-400">{formatCurrency(rev.totalAmount)}</span>
                      <Badge variant={payVariant[rev.status]}>{PAYMENT_STATUS_LABELS[rev.status]}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Expenses</CardTitle>
              <CardDescription>Latest spending</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild><Link href="/admin/expenses">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <EmptyState title="No expenses recorded" />
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between rounded-lg border border-[rgba(148,163,184,0.1)] p-3">
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]">{expense.title}</p>
                      <p className="text-xs text-[#94A3B8]">{EXPENSE_CATEGORY_LABELS[expense.category]} · {formatDate(expense.date)}</p>
                    </div>
                    <span className="text-sm font-semibold text-red-400">{formatCurrency(expense.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
