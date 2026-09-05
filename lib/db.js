// Prisma client singleton with driver adapter (Prisma ORM v7 requirement)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function createClient() {
  try {
    const { PrismaPg } = require('@prisma/adapter-pg');
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      const adapter = new PrismaPg({ connectionString });
      return new PrismaClient({ adapter });
    }
  } catch {
    // fall through to bare client
  }
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
