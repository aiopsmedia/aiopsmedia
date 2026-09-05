import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminHeader from '@/components/admin/admin-header';

export const metadata = {
  title: 'Admin - AIOpsMedia',
  description: 'AIOpsMedia Admin Panel',
};

export default async function AdminLayout({ children }) {
  const session = await requireAuth();

  const [user, notifications] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, image: true },
    }),
    db.notification.findMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, title: true, message: true, type: true, link: true, createdAt: true },
    }),
  ]);

  return (
    <div className="flex min-h-screen bg-[#050816] text-[#F8FAFC]">
      <AdminSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader user={user} notifications={notifications} />
        <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
