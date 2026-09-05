import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import NotificationsPageClient from '@/components/admin/notifications-list';

export const metadata = {
  title: 'Notifications - AIOpsMedia Admin',
};

export default async function NotificationsPage() {
  const session = await requireAuth();

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return <NotificationsPageClient initialNotifications={notifications} />;
}
