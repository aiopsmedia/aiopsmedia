import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { CalendarCheck, CalendarX, Home, UserCheck } from 'lucide-react';
import { ATTENDANCE_STATUS_LABELS } from '@/config/constants';

export const metadata = {
  title: 'Attendance - AIOpsMedia Admin',
};

const statusVariant = {
  PRESENT: 'success',
  ABSENT: 'danger',
  HALF_DAY: 'warning',
  LEAVE: 'info',
  WORK_FROM_HOME: 'default',
};

export default async function AttendancePage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const dateRaw = sp?.date || '';
  const filterDate = dateRaw ? new Date(dateRaw) : new Date();

  const where = { date: filterDate };

  const [records, employees, presentCount, wfhCount, absentCount] = await Promise.all([
    db.attendance.findMany({
      where,
      include: { employee: { select: { id: true, name: true, designation: true, department: true } } },
      orderBy: { employee: { name: 'asc' } },
    }),
    db.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
    db.attendance.count({ where: { ...where, status: 'PRESENT' } }),
    db.attendance.count({ where: { ...where, status: 'WORK_FROM_HOME' } }),
    db.attendance.count({ where: { ...where, status: 'ABSENT' } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Attendance</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Daily attendance records for {formatDate(filterDate)}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Employees" value={employees} icon={UserCheck} />
        <StatCard label="Present" value={presentCount} icon={CalendarCheck} />
        <StatCard label="Absent" value={absentCount} icon={CalendarX} />
        <StatCard label="Work From Home" value={wfhCount} icon={Home} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily Records</CardTitle>
          <CardDescription>Attendance for the selected date</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <EmptyState title="No attendance records" description="No records exist for this date." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)] text-left text-xs uppercase tracking-wider text-[#94A3B8]">
                    <th className="py-3 pr-4 font-medium">Employee</th>
                    <th className="py-3 pr-4 font-medium">Designation</th>
                    <th className="py-3 pr-4 font-medium">Department</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b border-[rgba(148,163,184,0.08)]">
                      <td className="py-3 pr-4 font-medium text-[#F8FAFC]">{r.employee.name}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{r.employee.designation || '—'}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{r.employee.department}</td>
                      <td className="py-3">
                        <Badge variant={statusVariant[r.status]}>{ATTENDANCE_STATUS_LABELS[r.status]}</Badge>
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
