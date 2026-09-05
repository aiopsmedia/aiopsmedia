import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/session';
import { formatCurrency, formatDate, formatRelativeTime, getInitials } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import {
  RevenueLineChart,
  LeadFunnelChart,
  ProjectStatusChart,
  RevenueByServiceChart,
  ExpenseByCategoryChart,
  ChartCard,
} from '@/components/admin/dashboard-charts';
import { PROJECT_STATUS_LABELS, LEAD_STATUS_LABELS, LEAD_STATUSES, PROJECT_STATUSES, ROLE_LABELS } from '@/config/constants';
import {
  IndianRupee,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Users,
  CheckCircle2,
  Target,
  FolderKanban,
  Clock,
  CheckCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const metadata = {
  title: 'Dashboard - AIOpsMedia Admin',
};

const statusVariantMap = {
  NEW: 'info',
  CONTACTED: 'warning',
  QUALIFIED: 'default',
  PROPOSAL: 'info',
  NEGOTIATION: 'warning',
  WON: 'success',
  LOST: 'danger',
  CLOSED: 'outline',
  PLANNING: 'info',
  IN_PROGRESS: 'warning',
  ON_HOLD: 'outline',
  REVIEW: 'default',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  TODO: 'outline',
  DONE: 'success',
  PENDING: 'warning',
  PARTIAL: 'warning',
  PAID: 'success',
};

function getStatusVariant(status) {
  return statusVariantMap[status] || 'outline';
}

export default async function AdminDashboard({ searchParams }) {
  const session = await requireAuth();
  const sp = await searchParams;
  const range = sp?.range || '30d';

  const now = new Date();
  const startOfRange = (() => {
    const d = new Date(now);
    switch (range) {
      case 'today':
        d.setHours(0, 0, 0, 0);
        return d;
      case '7d':
        d.setDate(d.getDate() - 7);
        return d;
      case '30d':
        d.setDate(d.getDate() - 30);
        return d;
      case 'this_month':
        return new Date(d.getFullYear(), d.getMonth(), 1);
      case 'last_month':
        return new Date(d.getFullYear(), d.getMonth() - 1, 1);
      case 'this_year':
        return new Date(d.getFullYear(), 0, 1);
      default:
        d.setDate(d.getDate() - 30);
        return d;
    }
  })();

  const endOfLastMonth = range === 'last_month' ? new Date(startOfRange.getFullYear(), startOfRange.getMonth() + 1, 0) : now;

  const periodStart = range === 'last_month' ? startOfRange : startOfRange;
  const periodEnd = range === 'last_month' ? endOfLastMonth : now;

  const [
    totalRevenue,
    totalExpenses,
    projectedRevenue,
    leadTotals,
    qualifiedLeads,
    wonLeads,
    totalLeads,
    projectTotals,
    activeProjects,
    completedProjects,
    overdueProjects,
    recentActivity,
    recentLeads,
    overdueTasks,
    members,
    monthlyRevenue,
    monthlyExpenses,
    revenueByService,
    expenseByCategory,
  ] = await Promise.all([
    db.revenue.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['PAID', 'PARTIAL'] } },
    }),
    db.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: periodStart, lte: periodEnd } },
    }),
    db.revenue.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'PENDING' },
    }),
    db.lead.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    db.lead.count({ where: { status: { in: ['QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON'] } } }),
    db.lead.count({ where: { status: 'WON' } }),
    db.lead.count(),
    db.project.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    db.project.count({ where: { status: { in: ['IN_PROGRESS', 'REVIEW'] } } }),
    db.project.count({ where: { status: 'COMPLETED' } }),
    db.project.count({ where: { status: { in: ['IN_PROGRESS', 'PLANNING', 'REVIEW'] }, deadline: { lt: now } } }),
    db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } } },
    }),
    db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { assignedTo: { select: { name: true } } },
    }),
    db.task.findMany({
      where: { status: { not: 'DONE' }, dueDate: { not: null } },
      orderBy: { dueDate: 'asc' },
      take: 8,
      include: { assignee: { select: { name: true } }, project: { select: { name: true, slug: true } } },
    }),
    db.user.findMany({
      select: { name: true, id: true },
      orderBy: { name: 'asc' },
    }),
    db.revenue.groupBy({
      by: ['createdAt'],
      _sum: { totalAmount: true },
    }),
    db.expense.findMany({
      where: { date: { gte: new Date(new Date().getFullYear(), 0, 1) } },
      select: { amount: true, date: true },
    }),
    db.revenue.findMany({
      where: { status: { in: ['PAID', 'PARTIAL'] } },
      select: { title: true, totalAmount: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.expense.groupBy({
      by: ['category'],
      _sum: { amount: true },
    }),
  ]);

  const totalRevenueValue = Number(totalRevenue._sum.totalAmount || 0);
  const totalExpensesValue = Number(totalExpenses._sum.amount || 0);
  const netProfit = totalRevenueValue - totalExpensesValue;
  const outstandingValue = Number(projectedRevenue._sum.totalAmount || 0);

  const totalRevenueAll = totalRevenueValue;
  const leadCounts = Object.fromEntries(
    LEAD_STATUSES.map((s) => [s, 0])
  );
  leadTotals.forEach((row) => {
    leadCounts[row.status] = row._count._all;
  });

  const projectCounts = Object.fromEntries(
    PROJECT_STATUSES.map((s) => [s, 0])
  );
  projectTotals.forEach((row) => {
    projectCounts[row.status] = row._count._all;
  });

  const totalProjects = Object.values(projectCounts).reduce((a, b) => a + b, 0);

  const monthlyRevenueMap = {};
  const monthlyExpenseMap = {};
  monthlyRevenue.forEach((row) => {
    const key = new Date(row.createdAt).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + Number(row._sum.totalAmount || 0);
  });
  monthlyExpenses.forEach((row) => {
    const key = new Date(row.date).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    monthlyExpenseMap[key] = (monthlyExpenseMap[key] || 0) + Number(row.amount || 0);
  });

  const monthLabels = [];
  const current = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
    monthLabels.push(d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }));
  }

  const monthlyChartData = monthLabels.map((m) => ({
    month: m,
    revenue: monthlyRevenueMap[m] || 0,
    expenses: monthlyExpenseMap[m] || 0,
  }));

  const leadFunnelData = [
    { name: 'New', count: leadCounts.NEW },
    { name: 'Contacted', count: leadCounts.CONTACTED },
    { name: 'Qualified', count: leadCounts.QUALIFIED },
    { name: 'Proposal', count: leadCounts.PROPOSAL },
    { name: 'Negotiation', count: leadCounts.NEGOTIATION },
    { name: 'Won', count: leadCounts.WON },
  ];

  const projectStatusData = Object.entries(projectCounts)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => ({ name: PROJECT_STATUS_LABELS[name], count }));

  const serviceRevenueMap = {};
  revenueByService.forEach((row) => {
    const name = row.title || 'Direct';
    serviceRevenueMap[name] = (serviceRevenueMap[name] || 0) + Number(row.totalAmount || 0);
  });
  const revenueByServiceData = Object.entries(serviceRevenueMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, revenue]) => ({ name, revenue }));

  const expenseCategoryData = expenseByCategory
    .map((row) => ({
      name: row.category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      amount: Number(row._sum.amount || 0),
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 1000) / 10 : 0;

  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            {greeting}, {session.user.name || 'there'}
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Here&apos;s what&apos;s happening across your business today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ['today', 'Today'],
            ['7d', '7 Days'],
            ['30d', '30 Days'],
            ['this_month', 'This Month'],
            ['last_month', 'Last Month'],
            ['this_year', 'This Year'],
          ].map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={range === value ? 'default' : 'outline'}
              className={range === value ? 'bg-[#22D3EE]/15 text-[#22D3EE] hover:bg-[#22D3EE]/25 shadow-none border border-[#22D3EE]/20' : ''}
              asChild
            >
              <Link href={`/admin?range=${value}`}>{label}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenueValue)} icon={IndianRupee} />
        <StatCard label="Total Expenses" value={formatCurrency(totalExpensesValue)} icon={TrendingDown} />
        <StatCard
          label="Net Profit"
          value={formatCurrency(netProfit)}
          change={netProfit >= 0 ? 100 : -100}
          icon={PiggyBank}
        />
        <StatCard label="Outstanding" value={formatCurrency(outstandingValue)} icon={Clock} />
      </div>

      {/* Sales KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Leads" value={totalLeads} icon={Users} />
        <StatCard label="Qualified Leads" value={qualifiedLeads} icon={CheckCircle2} />
        <StatCard label="Won Deals" value={wonLeads} icon={Target} />
        <StatCard label="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} />
      </div>

      {/* Project KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={totalProjects} icon={FolderKanban} />
        <StatCard label="Active Projects" value={activeProjects} icon={FolderKanban} />
        <StatCard label="Completed Projects" value={completedProjects} icon={CheckCheck} />
        <StatCard label="Overdue Projects" value={overdueProjects} icon={AlertTriangle} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue vs Expenses" description="Monthly revenue and expense comparison (this year)">
          <RevenueLineChart data={monthlyChartData} />
        </ChartCard>
        <ChartCard title="Lead Funnel" description="Leads by current stage">
          <LeadFunnelChart data={leadFunnelData} />
        </ChartCard>
        <ChartCard title="Project Status" description="Distribution of projects by status">
          <ProjectStatusChart data={projectStatusData} />
        </ChartCard>
        <ChartCard title="Revenue by Project / Client" description="Top revenue sources">
          <RevenueByServiceChart data={revenueByServiceData} />
        </ChartCard>
        <ChartCard title="Expense by Category" description="Where your money is going">
          <ExpenseByCategoryChart data={expenseCategoryData} />
        </ChartCard>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest system actions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/audit">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <EmptyState title="No activity yet" description="System activity will appear here." />
            ) : (
              <div className="space-y-4">
                {recentActivity.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111827] text-xs font-semibold text-[#22D3EE]">
                      {getInitials(entry.user?.name || 'System')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[#F8FAFC]">
                        <span className="font-medium">{entry.user?.name || 'System'}</span>{' '}
                        <span className="text-[#94A3B8]">
                          {entry.action} {entry.resource}
                        </span>
                      </p>
                      <p className="text-xs text-[#94A3B8]">{formatRelativeTime(entry.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Leads</CardTitle>
              <CardDescription>Latest leads added</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/leads">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <EmptyState title="No leads yet" description="Add your first lead to get started." />
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#111827]/40 p-3">
                    <div className="min-w-0">
                      <Link href="/admin/leads" className="block truncate text-sm font-medium text-[#F8FAFC] hover:text-[#22D3EE]">
                        {lead.name}
                      </Link>
                      <p className="truncate text-xs text-[#94A3B8]">
                        {lead.company || '—'} · {lead.assignedTo?.name || 'Unassigned'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={getStatusVariant(lead.status)}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
                      <span className="text-xs text-[#94A3B8]">{formatDate(lead.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Overdue Tasks</CardTitle>
              <CardDescription>Tasks past their due date</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/tasks">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 ? (
              <EmptyState title="No overdue tasks" description="You're all caught up." />
            ) : (
              <div className="space-y-3">
                {overdueTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border border-[#F87171]/20 bg-[#F87171]/5 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#F8FAFC]">{task.title}</p>
                      <p className="truncate text-xs text-[#94A3B8]">
                        {task.project?.name || 'Project'} · Due {formatDate(task.dueDate)} · {task.assignee?.name || 'Unassigned'}
                      </p>
                    </div>
                    <Badge variant="danger">Overdue</Badge>
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
