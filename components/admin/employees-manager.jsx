'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, getInitials } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Search, Plus, Filter, Users as UsersIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { DEPARTMENT_LABELS, EMPLOYMENT_STATUS_LABELS } from '@/config/constants';

const statusVariant = {
  ACTIVE: 'success',
  INACTIVE: 'outline',
  ON_NOTICE: 'warning',
  TERMINATED: 'danger',
  RESIGNED: 'warning',
};

export default function EmployeesManager({ initialEmployees, total, initialFilters, departments, employmentStatuses }) {
  const router = useRouter();
  const [filters, setFilters] = React.useState(initialFilters);

  const updateUrl = (next) => {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/admin/employees?${params.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value, page: 1 };
    setFilters(next);
    updateUrl(next);
  };

  const handlePageChange = (page) => {
    const next = { ...filters, page };
    setFilters(next);
    updateUrl(next);
  };

  const handlePageSizeChange = (pageSize) => {
    const next = { ...filters, pageSize, page: 1 };
    setFilters(next);
    updateUrl(next);
  };

  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Employees</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage your team members and their information.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                className="pl-10"
                placeholder="Search employees..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filters.department || 'all'} onValueChange={(v) => handleFilterChange('department', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => <SelectItem key={d} value={d}>{DEPARTMENT_LABELS[d]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {employmentStatuses.map((s) => <SelectItem key={s} value={s}>{EMPLOYMENT_STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
              {(filters.search || filters.department || filters.status) && (
                <Button variant="ghost" size="sm" onClick={() => router.push('/admin/employees')}>
                  <Filter className="h-4 w-4" /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {initialEmployees.length === 0 ? (
        <Card>
          <EmptyState
            icon={UsersIcon}
            title="No employees found"
            description="Add your first employee to get started."
            action="Add Employee"
            onAction={() => {}}
          />
        </Card>
      ) : (
        <>
          <Card className="hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)]">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Employee</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Department</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Designation</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Status</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Joining Date</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {initialEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[#111827]/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={employee.profileImage} alt={employee.name}>
                            {employee.name}
                          </Avatar>
                          <div>
                            <p className="font-medium text-[#F8FAFC]">{employee.name}</p>
                            <p className="text-xs text-[#94A3B8]">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#94A3B8]">{DEPARTMENT_LABELS[employee.department]}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{employee.designation || '—'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[employee.employmentStatus]}>{EMPLOYMENT_STATUS_LABELS[employee.employmentStatus]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-[#94A3B8]">{employee.joiningDate ? formatDate(employee.joiningDate) : '—'}</td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Pencil className="h-4 w-4" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400"><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4">
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={total}
                pageSize={filters.pageSize}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {initialEmployees.map((employee) => (
              <Card key={employee.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={employee.profileImage} alt={employee.name}>{employee.name}</Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#F8FAFC]">{employee.name}</p>
                    <p className="truncate text-xs text-[#94A3B8]">{employee.designation || '—'}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant={statusVariant[employee.employmentStatus]}>{EMPLOYMENT_STATUS_LABELS[employee.employmentStatus]}</Badge>
                  <span className="text-xs text-[#94A3B8]">{DEPARTMENT_LABELS[employee.department]}</span>
                </div>
                <p className="mt-2 text-xs text-[#94A3B8]">Joined {employee.joiningDate ? formatDate(employee.joiningDate) : '—'}</p>
              </Card>
            ))}
          </div>
          {initialEmployees.length > 0 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={total}
              pageSize={filters.pageSize}
            />
          )}
        </>
      )}
    </div>
  );
}
