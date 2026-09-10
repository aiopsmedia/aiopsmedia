// Prisma client singleton with driver adapter (Prisma ORM v7 requirement)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function sanitizeConnectionString(url) {
  if (!url) return url;
  try {
    // pg-connection-string v3 warns when sslmode=require/verify-ca/prefer
    // Neon typically uses sslmode=require. Normalize to verify-full to silence the
    // SECURITY WARNING while keeping strict verification (same cert checks).
    // If the user explicitly wants libpq compat, honour uselibpqcompat flag.
    if (url.includes('sslmode=')) {
      if (url.includes('uselibpqcompat')) return url;
      // replace weak modes with verify-full
      return url
        .replace(/sslmode=require/g, 'sslmode=verify-full')
        .replace(/sslmode=verify-ca/g, 'sslmode=verify-full')
        .replace(/sslmode=prefer/g, 'sslmode=verify-full');
    }
    // No sslmode at all — ensure encrypted (Neon requires). Append verify-full.
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}sslmode=verify-full`;
  } catch {
    return url;
  }
}

function createClient() {
  try {
    const { PrismaPg } = require('@prisma/adapter-pg');
    const raw = process.env.DATABASE_URL;
    if (raw) {
      const connectionString = sanitizeConnectionString(raw);
      const adapter = new PrismaPg({ connectionString });
      return new PrismaClient({ adapter });
    }
  } catch (e) {
    console.warn('[db] adapter init failed, falling back to bare PrismaClient', e?.message);
  }
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
