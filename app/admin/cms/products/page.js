import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import ProductsManager from '@/components/admin/products-manager';

export const metadata = {
  title: 'Products - AIOpsMedia Admin',
};

export default async function ProductsPage() {
  await requireAuth();

  const [products, services] = await Promise.all([
    db.product.findMany({
      orderBy: { order: 'asc' },
      include: { service: { select: { id: true, title: true } } },
    }),
    db.service.findMany({
      where: { isActive: true },
      select: { id: true, title: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  return <ProductsManager initialProducts={products} services={services} />;
}
