import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { PiggyBank, TrendingUp, AlertTriangle, Wallet } from 'lucide-react';
import { DEPARTMENT_LABELS } from '@/config/constants';

export const metadata = {
  title: 'Budgets - AIOpsMedia Admin',
};

export default async function BudgetsPage() {
  await requireAuth();

  const [budgets, totalAlloc, totalSpent] = await Promise.all([
    db.budget.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        name: true,
        amount: true,
        spent: true,
        department: true,
        startDate: true,
        endDate: true,
        createdBy: { select: { id: true, name: true } },
      },
    }),
    db.budget.aggregate({ _sum: { amount: true } }),
    db.budget.aggregate({ _sum: { spent: true } }),
  ]);

  const allocated = Number(totalAlloc._sum.amount || 0);
  const spent = Number(totalSpent._sum.spent || 0);
  const overBudget = budgets.filter((b) => Number(b.spent) > Number(b.amount)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Budgets</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Track departmental and project budgets.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Budgets" value={budgets.length} icon={PiggyBank} />
        <StatCard label="Allocated" value={formatCurrency(allocated)} icon={Wallet} />
        <StatCard label="Spent" value={formatCurrency(spent)} icon={TrendingUp} />
        <StatCard label="Over Budget" value={overBudget} icon={AlertTriangle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Budget Overview</CardTitle>
          <CardDescription>Allocation vs spend for each budget</CardDescription>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <EmptyState title="No budgets created" description="Create budgets to track spending limits." />
          ) : (
            <div className="space-y-4">
              {budgets.map((b) => {
                const pct = Number(b.amount) > 0 ? Math.min(100, Math.round((Number(b.spent) / Number(b.amount)) * 100)) : 0;
                const over = Number(b.spent) > Number(b.amount);
                return (
                  <div key={b.id} className="rounded-lg border border-[rgba(148,163,184,0.1)] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#F8FAFC]">{b.name}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {b.department ? DEPARTMENT_LABELS[b.department] : 'General'}
                          {b.createdBy?.name ? ` · ${b.createdBy.name}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#F8FAFC]">
                          {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                        </span>
                        {over && <Badge variant="danger">Over Budget</Badge>}
                      </div>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#111827]">
                      <div
                        className={`h-full rounded-full ${over ? 'bg-red-500' : 'bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-[#94A3B8]">{pct}% used</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
