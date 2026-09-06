'use server';

import { signIn as authSignIn, signOut as authSignOut } from '@/lib/auth';
import { db } from '@/lib/db';

export async function login(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const callbackUrl =
    typeof formData.get('callbackUrl') === 'string' &&
    formData.get('callbackUrl').startsWith('/')
      ? formData.get('callbackUrl')
      : '/admin';

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    console.log(`[login] Attempting sign-in for ${email}`);
    await authSignIn('credentials', {
      email,
      password,
      redirect: false,
      redirectTo: callbackUrl,
    });
    console.log(`[login] Credentials accepted for ${email}`);
  } catch (err) {
    const message =
      err?.cause?.err?.message ||
      err?.cause?.message ||
      err?.message ||
      '';
    const isInvalidCredentials =
      message === 'CredentialsSignin' ||
      err?.code === 'credentials' ||
      err?.type === 'CredentialsSignin';

    if (isInvalidCredentials) {
      console.warn(`[login] Invalid credentials rejected for ${email}`);
      return { error: 'Invalid email or password.' };
    }

    console.error(`[login] Sign-in failed for ${email}:`, err);
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true, role: true },
    });

    if (user) {
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: 'login',
          resource: 'auth',
          metadata: JSON.stringify({
            name: user.name,
            role: user.role,
            timestamp: new Date().toISOString(),
          }),
        },
      });
    }
  } catch (err) {
    console.error('[login] Failed to write audit log (non-fatal):', err?.message || err);
  }

  console.log(`[login] Redirecting ${email} to ${callbackUrl}`);
  return { success: true, redirectTo: callbackUrl };
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
  return { success: true };
}
