import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '@/lib/db';

const PLACEHOLDER_SECRET = 'generate-with-npx-auth-secret';

/**
 * next.config.mjs injects the generated secret into process.env.AUTH_SECRET
 * at boot when it is not configured, so the proxy and route handlers share
 * the same value.
 */
function getAuthSecret() {
  const raw = process.env.AUTH_SECRET || '';
  const secret = raw.trim();
  if (secret && secret !== PLACEHOLDER_SECRET) return secret;
  console.warn(
    '[auth] AUTH_SECRET missing — using a per-process random secret. ' +
      'Set AUTH_SECRET in your environment or run scripts/generate-auth-secret.mjs before building.'
  );
  return crypto.randomBytes(32).toString('hex');
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: getAuthSecret(),
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.isActive) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
