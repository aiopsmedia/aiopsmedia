import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import NavigationManager from '@/components/admin/navigation-manager';

export const metadata = {
  title: 'Navigation - AIOpsMedia Admin',
};

export default async function NavigationPage() {
  await requireAuth();

  const items = await db.navigation.findMany({
    orderBy: { order: 'asc' },
  });

  return <NavigationManager initialItems={items} />;
}
