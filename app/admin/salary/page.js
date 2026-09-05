import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Wallet, BadgeIndianRupee, TrendingUp, Clock4 } from 'lucide-react';

export const metadata = {
  title: 'Salary - AIOpsMedia Admin',
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default async function SalaryPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const now = new Date();
  const year = parseInt(sp?.year) || now.getFullYear();
  const month = parseInt(sp?.month) || now.getMonth() + 1;

  const where = { year, month };

  const [salaries, employees, totalPaid] = await Promise.all([
    db.salary.findMany({
      where,
      include: { employee: { select: { id: true, name: true, designation: true, department: true } } },
      orderBy: { employee: { name: 'asc' } },
    }),
    db.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
    db.salary.aggregate({ _sum: { netPay: true }, where: { ...where, paidAt: { not: null } } }),
  ]);

  const paidAmount = Number(totalPaid._sum.netPay || 0);
  const paidCount = salaries.filter((s) => s.paidAt).length;
  const pendingCount = salaries.filter((s) => !s.paidAt).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Salary</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Salary records for {monthNames[month - 1]} {year}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Employees" value={employees} icon={Wallet} />
        <StatCard label="Salary Records" value={salaries.length} icon={BadgeIndianRupee} />
        <StatCard label="Paid" value={paidCount} icon={TrendingUp} />
        <StatCard label="Pending" value={pendingCount} icon={Clock4} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Salary Records</CardTitle>
            <CardDescription>Total paid this month: {formatCurrency(paidAmount)}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {salaries.length === 0 ? (
            <EmptyState title="No salary records" description="No salary records exist for this month." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)] text-left text-xs uppercase tracking-wider text-[#94A3B8]">
                    <th className="py-3 pr-4 font-medium">Employee</th>
                    <th className="py-3 pr-4 font-medium">Designation</th>
                    <th className="py-3 pr-4 font-medium">Base Pay</th>
                    <th className="py-3 pr-4 font-medium">Deductions</th>
                    <th className="py-3 pr-4 font-medium">Bonus</th>
                    <th className="py-3 pr-4 font-medium">Net Pay</th>
                    <th className="py-3 font-medium">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((s) => (
                    <tr key={s.id} className="border-b border-[rgba(148,163,184,0.08)]">
                      <td className="py-3 pr-4 font-medium text-[#F8FAFC]">{s.employee.name}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{s.employee.designation || '—'}</td>
                      <td className="py-3 pr-4 text-[#94A3B8]">{formatCurrency(s.basePay)}</td>
                      <td className="py-3 pr-4 text-red-400">{formatCurrency(s.deductions)}</td>
                      <td className="py-3 pr-4 text-emerald-400">{formatCurrency(s.bonus)}</td>
                      <td className="py-3 pr-4 font-semibold text-[#F8FAFC]">{formatCurrency(s.netPay)}</td>
                      <td className="py-3">
                        {s.paidAt ? (
                          <Badge variant="success">{formatDate(s.paidAt)}</Badge>
                        ) : (
                          <Badge variant="warning">Unpaid</Badge>
                        )}
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
