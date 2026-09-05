import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import ServicesManager from '@/components/admin/services-manager';

export const metadata = {
  title: 'Services - AIOpsMedia Admin',
};

export default async function ServicesPage() {
  await requireAuth();

  const services = await db.service.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true, blogs: true } } },
  });

  return <ServicesManager initialServices={services} />;
}
