import { requireAuth, getCurrentUser } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Shield, User2, Building2, CalendarDays, Clock4 } from 'lucide-react';
import { ROLE_LABELS, DEPARTMENT_LABELS, EMPLOYMENT_STATUS_LABELS } from '@/config/constants';

export const metadata = {
  title: 'My Profile - AIOpsMedia Admin',
};

export default async function ProfilePage() {
  await requireAuth();
  const user = await getCurrentUser();

  if (!user) return null;

  const employee = user
    ? await db.employee.findUnique({ where: { userId: user.id } })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">My Profile</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">View your account and employee information.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] text-xl font-bold text-[#050816]">
              {user.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">{user.name || 'User'}</h2>
              <p className="text-sm text-[#94A3B8]">{user.email}</p>
            </div>
            <Badge className="ml-auto">{ROLE_LABELS[user.role]}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Role" value={ROLE_LABELS[user.role] || user.role} icon={Shield} />
        <StatCard label="Email" value={user.email} icon={Mail} />
        <StatCard label="User ID" value={user.id.slice(0, 8)} icon={User2} />
        <StatCard label="Employee" value={employee ? 'Linked' : 'Not linked'} icon={Building2} />
      </div>

      {employee && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Employee Details</CardTitle>
            <CardDescription>HR record linked to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#94A3B8]">Designation</p>
                <p className="mt-1 text-sm font-medium text-[#F8FAFC]">{employee.designation || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#94A3B8]">Department</p>
                <p className="mt-1 text-sm font-medium text-[#F8FAFC]">{DEPARTMENT_LABELS[employee.department]}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#94A3B8]">Status</p>
                <p className="mt-1 text-sm font-medium text-[#F8FAFC]">{EMPLOYMENT_STATUS_LABELS[employee.employmentStatus]}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#94A3B8]">Joining Date</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-medium text-[#F8FAFC]">
                  <CalendarDays className="h-3.5 w-3.5 text-[#22D3EE]" />
                  {employee.joiningDate ? formatDate(employee.joiningDate) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#94A3B8]">Phone</p>
                <p className="mt-1 text-sm font-medium text-[#F8FAFC]">{employee.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#94A3B8]">Salary</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-medium text-[#F8FAFC]">
                  <Clock4 className="h-3.5 w-3.5 text-[#22D3EE]" />
                  {employee.salary ? `₹${Number(employee.salary)}` : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
