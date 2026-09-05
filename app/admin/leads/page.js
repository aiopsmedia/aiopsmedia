import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import LeadsManager from '@/components/admin/leads-manager';
import { LEAD_STATUSES, LEAD_PRIORITIES, LEAD_SOURCES } from '@/config/constants';

export const metadata = {
  title: 'Leads - AIOpsMedia Admin',
};

export default async function LeadsPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;

  const search = sp?.search || '';
  const status = sp?.status || '';
  const priority = sp?.priority || '';
  const source = sp?.source || '';
  const assigned = sp?.assigned || '';
  const sortBy = sp?.sortBy || 'createdAt';
  const sortDir = sp?.sortDir || 'desc';
  const page = Math.max(1, parseInt(sp?.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp?.pageSize) || 10));

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (source) where.source = source;
  if (assigned) where.assignedToId = assigned;

  const [leads, total, users, services] = await Promise.all([
    db.lead.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { name: true } },
      },
      orderBy: { [sortBy]: sortDir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.lead.count({ where }),
    db.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
    db.service.findMany({
      where: { isActive: true },
      select: { id: true, title: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  return (
    <LeadsManager
      initialLeads={leads.map((lead) => ({
        ...lead,
        budget: lead.budget,
        followUpDate: lead.followUpDate,
      }))}
      total={total}
      initialFilters={{ search, status, priority, source, assigned, sortBy, sortDir, page, pageSize }}
      users={users}
      services={services}
      statuses={LEAD_STATUSES}
      priorities={LEAD_PRIORITIES}
      sources={LEAD_SOURCES}
    />
  );
}
