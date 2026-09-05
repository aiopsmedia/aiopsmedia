import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { CalendarOff, CheckCircle2, Clock4, XCircle } from 'lucide-react';
import { LEAVE_TYPE_LABELS, LEAVE_STATUS_LABELS } from '@/config/constants';

export const metadata = {
  title: 'Leaves - AIOpsMedia Admin',
};

const statusVariant = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'outline',
};

export default async function LeavesPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const status = sp?.status || '';
  const year = parseInt(sp?.year) || new Date().getFullYear();

  const where = { year };
  if (status) where.status = status;

  const [leaves, pending, approved, rejected] = await Promise.all([
    db.leave.findMany({
      where,
      include: { employee: { select: { id: true, name: true, designation: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    db.leave.count({ where: { ...where, status: 'PENDING' } }),
    db.leave.count({ where: { ...where, status: 'APPROVED' } }),
    db.leave.count({ where: { ...where, status: 'REJECTED' } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Leave Requests</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Manage employee leave requests for {year}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Requests" value={leaves.length} icon={CalendarOff} />
        <StatCard label="Pending" value={pending} icon={Clock4} />
        <StatCard label="Approved" value={approved} icon={CheckCircle2} />
        <StatCard label="Rejected" value={rejected} icon={XCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leave Requests</CardTitle>
          <CardDescription>All leave requests for the selected year</CardDescription>
        </CardHeader>
        <CardContent>
          {leaves.length === 0 ? (
            <EmptyState title="No leave requests" description="There are no leave requests for this period." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)] text-left text-xs uppercase tracking-wider text-[#94A3B8]">
                    <th className="py-3 pr-4 font-medium">Employee</th>
                    <th className="py-3 pr-4 font-medium">Type</th>
                    <th className="py-3 pr-4 font-medium">Start</th>
                    <th className="py-3 pr-4 font-medium">End</th>
                    <th className="py-3 pr-4 font-medium">Days</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l) => (
                    <tr key={l.id} className="border-b border-[rgba(148,163,184,0.08)]">
                      <td className="py-3 pr-4 font-medium text-[#F8FAFC]">{l.employee.name}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{LEAVE_TYPE_LABELS[l.type]}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{formatDate(l.startDate)}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{formatDate(l.endDate)}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{l.days}</td>
                      <td className="py-3">
                        <Badge variant={statusVariant[l.status]}>{LEAVE_STATUS_LABELS[l.status]}</Badge>
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
