import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import ClientsManager from '@/components/admin/clients-manager';

export const metadata = {
  title: 'Clients - AIOpsMedia Admin',
};

export default async function ClientsPage() {
  await requireAuth();

  const clients = await db.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { projects: true, invoices: true } } },
  });

  return <ClientsManager initialClients={clients} />;
}
