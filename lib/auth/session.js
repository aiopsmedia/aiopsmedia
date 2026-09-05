import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, image: true },
  });

  return user;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireRole(...roles) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) {
    throw new Error('Forbidden');
  }
  return session;
}
