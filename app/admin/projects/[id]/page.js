import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import TaskBoard from '@/components/admin/task-board';
import { ArrowLeft, Paperclip, StickyNote, Settings, Users, CalendarDays, FileText } from 'lucide-react';
import { PROJECT_STATUS_LABELS, LEAD_PRIORITY_LABELS as PRIORITY_LABELS, PAYMENT_STATUS_LABELS } from '@/config/constants';

const statusVariant = {
  PLANNING: 'info',
  IN_PROGRESS: 'warning',
  ON_HOLD: 'outline',
  REVIEW: 'default',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

const priorityVariant = {
  LOW: 'outline',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
};

export default async function ProjectDetailPage({ params }) {
  await requireAuth();
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, companyName: true, email: true, phone: true } },
      manager: { select: { id: true, name: true, email: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      },
      tasks: {
        include: { assignee: { select: { id: true, name: true } } },
        orderBy: [{ status: 'asc' }, { order: 'asc' }],
      },
      milestones: { orderBy: { order: 'asc' } },
      expenses: { orderBy: { date: 'desc' }, take: 8 },
      invoices: {
        include: { client: { select: { companyName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 8,
      },
      revenueRecords: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!project) notFound();

  const activityLog = await db.auditLog.findMany({
    where: { resourceId: id, resource: 'project' },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { user: { select: { name: true } } },
  });

  const totalBudget = Number(project.budget || 0);
  const totalExpenses = project.expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalRevenue = project.revenueRecords.reduce((s, r) => s + Number(r.totalAmount || 0), 0);
  const budgetPct = totalBudget > 0 ? Math.min(100, Math.round((totalExpenses / totalBudget) * 100)) : 0;
  const progress = project.progress;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{project.name}</h1>
            <Badge variant={statusVariant[project.status]}>{PROJECT_STATUS_LABELS[project.status]}</Badge>
            <Badge variant={priorityVariant[project.priority]}>{PRIORITY_LABELS[project.priority]}</Badge>
          </div>
          <p className="mt-1 text-sm text-[#94A3B8]">
            {project.client?.companyName || 'No client'} · Started {project.startDate ? formatDate(project.startDate) : '—'} · Deadline {project.deadline ? formatDate(project.deadline) : '—'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/projects/${id}/edit`}>
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/invoices/new?project=${id}`}>
              <FileText className="h-4 w-4" /> Create Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-[#94A3B8]">Budget</p>
            <p className="mt-1 text-2xl font-bold text-[#F8FAFC]">{formatCurrency(totalBudget)}</p>
            <div className="mt-2 flex items-center gap-2">
              <Progress value={budgetPct} className="h-2 flex-1" />
              <span className="text-xs text-[#94A3B8]">{budgetPct}%</span>
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">Spent {formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-[#94A3B8]">Revenue</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">{formatCurrency(totalRevenue)}</p>
            <p className="mt-1 text-xs text-[#94A3B8]">Net {formatCurrency(totalRevenue - totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-[#94A3B8]">Progress</p>
            <p className="mt-1 text-2xl font-bold text-[#F8FAFC]">{progress}%</p>
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-[#94A3B8]">Payment Status</p>
            <p className="mt-1 text-2xl font-bold text-[#F8FAFC]">{PAYMENT_STATUS_LABELS[project.paymentStatus]}</p>
            <p className="mt-1 text-xs text-[#94A3B8]">{project.tasks.length} tasks · {project.members.length} members</p>
          </CardContent>
        </Card>
      </div>

      {project.description && (
        <Card>
          <CardContent className="p-5">
            <p className="whitespace-pre-wrap text-sm text-[#94A3B8]">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team ({project.members.length})</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TaskBoard tasks={project.tasks} users={project.members.map((m) => m.user)} projectId={project.id} />
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardContent className="p-6">
              {project.members.length === 0 ? (
                <EmptyState title="No team members" description="Add team members to this project." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#111827]/40 p-4">
                      <Avatar src={member.user.image} alt={member.user.name}>
                        {member.user.name}
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#F8FAFC]">{member.user.name}</p>
                        <p className="text-xs text-[#94A3B8]">{member.role || 'Member'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expenses</CardTitle>
                <CardDescription>Recent project expenses</CardDescription>
              </CardHeader>
              <CardContent>
                {project.expenses.length === 0 ? (
                  <EmptyState title="No expenses recorded" />
                ) : (
                  <div className="space-y-3">
                    {project.expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between rounded-lg border border-[rgba(148,163,184,0.1)] p-3">
                        <div>
                          <p className="text-sm font-medium text-[#F8FAFC]">{expense.title}</p>
                          <p className="text-xs text-[#94A3B8]">{expense.category.replace(/_/g, ' ')} · {formatDate(expense.date)}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#F8FAFC]">{formatCurrency(expense.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Invoices</CardTitle>
                <CardDescription>Project invoices</CardDescription>
              </CardHeader>
              <CardContent>
                {project.invoices.length === 0 ? (
                  <EmptyState title="No invoices" />
                ) : (
                  <div className="space-y-3">
                    {project.invoices.map((invoice) => (
                      <Link key={invoice.id} href={`/admin/invoices/${invoice.id}`} className="block rounded-lg border border-[rgba(148,163,184,0.1)] p-3 transition-colors hover:border-[#22D3EE]/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#F8FAFC]">{invoice.invoiceNumber}</p>
                            <p className="text-xs text-[#94A3B8]">{formatDate(invoice.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#F8FAFC]">{formatCurrency(invoice.total)}</p>
                            <Badge variant={statusVariant[invoice.status]}>{PAYMENT_STATUS_LABELS[invoice.status]}</Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="p-6">
              {activityLog.length === 0 ? (
                <EmptyState title="No activity yet" description="Project activity will appear here." />
              ) : (
                <div className="space-y-4">
                  {activityLog.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3">
                      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#22D3EE]" />
                      <div>
                        <p className="text-sm text-[#F8FAFC]">
                          <span className="font-medium">{entry.user?.name || 'System'}</span>{' '}
                          <span className="text-[#94A3B8]">{entry.action} {entry.resource}</span>
                        </p>
                        <p className="text-xs text-[#94A3B8]">{formatDate(entry.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardContent className="p-6">
              <EmptyState title="No files uploaded" description="Files will appear here." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardContent className="p-6">
              <EmptyState title="No notes yet" description="Add project notes here." />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
