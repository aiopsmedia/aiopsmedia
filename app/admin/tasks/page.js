import Link from 'next/link';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CheckSquare, Timer, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@/config/constants';

export const metadata = {
  title: 'Tasks - AIOpsMedia Admin',
};

const statusVariant = {
  TODO: 'outline',
  IN_PROGRESS: 'warning',
  REVIEW: 'info',
  DONE: 'success',
};

const priorityVariant = {
  LOW: 'outline',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
};

export default async function TasksPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const status = sp?.status || '';

  const where = {};
  if (status) where.status = status;

  const [totalTasks, doneTasks, tasks, projects] = await Promise.all([
    db.task.count(),
    db.task.count({ where: { status: 'DONE' } }),
    db.task.findMany({
      where,
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
      include: {
        project: { select: { id: true, name: true, slug: true } },
        assignee: { select: { id: true, name: true } },
      },
      take: 100,
    }),
    db.project.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  const pendingDue = await db.task.count({
    where: { status: { not: 'DONE' }, dueDate: { lte: new Date() } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Tasks</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Track tasks across all projects.</p>
        </div>
        <Button asChild size="sm"><Link href="/admin/projects">New Task via Project</Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Tasks" value={totalTasks} icon={CheckSquare} />
        <StatCard label="Completed" value={doneTasks} icon={Layers} />
        <StatCard label="Overdue" value={pendingDue} icon={AlertTriangle} />
        <StatCard label="Projects" value={projects.length} icon={Timer} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Tasks</CardTitle>
          <CardDescription>Recent and pending tasks across projects</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <EmptyState title="No tasks found" description="Create tasks through a project to get started." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)] text-left text-xs uppercase tracking-wider text-[#94A3B8]">
                    <th className="py-3 pr-4 font-medium">Task</th>
                    <th className="py-3 pr-4 font-medium">Project</th>
                    <th className="py-3 pr-4 font-medium">Assignee</th>
                    <th className="py-3 pr-4 font-medium">Due</th>
                    <th className="py-3 pr-4 font-medium">Priority</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b border-[rgba(148,163,184,0.08)]">
                      <td className="py-3 pr-4">
                        <Link href={`/admin/projects/${task.project.id}`} className="font-medium text-[#F8FAFC] hover:text-[#22D3EE]">
                          {task.title}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{task.project.name}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{task.assignee?.name || 'Unassigned'}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{task.dueDate ? formatDate(task.dueDate) : '—'}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={priorityVariant[task.priority]}>{TASK_PRIORITY_LABELS[task.priority]}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={statusVariant[task.status]}>{TASK_STATUS_LABELS[task.status]}</Badge>
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
