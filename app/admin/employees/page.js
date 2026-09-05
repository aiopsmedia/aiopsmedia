import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import EmployeesManager from '@/components/admin/employees-manager';
import { DEPARTMENTS, EMPLOYMENT_STATUSES } from '@/config/constants';

export const metadata = {
  title: 'Employees - AIOpsMedia Admin',
};

export default async function EmployeesPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;

  const search = sp?.search || '';
  const department = sp?.department || '';
  const status = sp?.status || '';
  const page = Math.max(1, parseInt(sp?.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp?.pageSize) || 10));

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { designation: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (department) where.department = department;
  if (status) where.employmentStatus = status;

  const [employees, total] = await Promise.all([
    db.employee.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.employee.count({ where }),
  ]);

  return (
    <EmployeesManager
      initialEmployees={employees}
      total={total}
      initialFilters={{ search, department, status, page, pageSize }}
      departments={DEPARTMENTS}
      employmentStatuses={EMPLOYMENT_STATUSES}
    />
  );
}
