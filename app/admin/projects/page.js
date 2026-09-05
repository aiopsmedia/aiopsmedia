import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import ProjectsManager from '@/components/admin/projects-manager';
import { PROJECT_STATUSES, PROJECT_PRIORITIES } from '@/config/constants';

export const metadata = {
  title: 'Projects - AIOpsMedia Admin',
};

export default async function ProjectsPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;

  const search = sp?.search || '';
  const status = sp?.status || '';
  const priority = sp?.priority || '';
  const client = sp?.client || '';
  const sortBy = sp?.sortBy || 'updatedAt';
  const sortDir = sp?.sortDir || 'desc';
  const page = Math.max(1, parseInt(sp?.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp?.pageSize) || 10));

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { client: { companyName: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (client) where.clientId = client;

  const [projects, total, clients, managers] = await Promise.all([
    db.project.findMany({
      where,
      include: {
        client: { select: { id: true, companyName: true } },
        manager: { select: { id: true, name: true } },
      },
      orderBy: { [sortBy]: sortDir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.project.count({ where }),
    db.client.findMany({
      select: { id: true, companyName: true },
      orderBy: { companyName: 'asc' },
    }),
    db.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <ProjectsManager
      initialProjects={projects}
      total={total}
      initialFilters={{ search, status, priority, client, sortBy, sortDir, page, pageSize }}
      clients={clients}
      managers={managers}
      statuses={PROJECT_STATUSES}
      priorities={PROJECT_PRIORITIES}
    />
  );
}
