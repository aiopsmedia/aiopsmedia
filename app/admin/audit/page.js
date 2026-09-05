import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import AuditManager from '@/components/admin/audit-manager';

export const metadata = {
  title: 'Audit Logs - AIOpsMedia Admin',
};

const PAGE_SIZE = 20;

export default async function AuditPage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page || '1', 10) || 1);
  const action = sp?.action || 'all';
  const resource = sp?.resource || 'all';

  const where = {};
  if (action !== 'all') where.action = action;
  if (resource !== 'all') where.resource = resource;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.auditLog.count({ where }),
  ]);

  const resources = await db.auditLog.findMany({
    distinct: ['resource'],
    select: { resource: true },
    orderBy: { resource: 'asc' },
  });

  return (
    <AuditManager
      initialLogs={logs}
      initialTotal={total}
      currentPage={page}
      currentAction={action}
      currentResource={resource}
      resources={resources.map((r) => r.resource).filter(Boolean)}
      pageSize={PAGE_SIZE}
    />
  );
}
