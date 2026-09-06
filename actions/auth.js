'use server';

import { signIn as authSignIn, signOut as authSignOut } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function login(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    await authSignIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (err) {
    const isInvalidCredentials =
      err?.cause?.err?.message === 'CredentialsSignin' ||
      err?.code === 'credentials' ||
      err?.type === 'CredentialsSignin' ||
      err?.message === 'CredentialsSignin';
    if (isInvalidCredentials) {
      return { error: 'Invalid email or password.' };
    }
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    });

    if (user) {
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: 'login',
          resource: 'auth',
          metadata: JSON.stringify({
            name: user.name,
            timestamp: new Date().toISOString(),
          }),
        },
      });
    }
  } catch {
    // Non-critical: don't block login if audit fails
  }

  redirect('/admin');
}

export async function logout() {
  try {
    const session = await (await import('@/lib/auth')).auth();

    if (session?.user?.id) {
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'logout',
          resource: 'auth',
          metadata: JSON.stringify({
            timestamp: new Date().toISOString(),
          }),
        },
      });
    }
  } catch {
    // Non-critical
  }

  await authSignOut({ redirect: false });
  redirect('/login');
}
