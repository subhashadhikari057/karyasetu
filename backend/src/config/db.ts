// ─────────────────────────────────────────────
// File: backend/src/config/db.ts
// Purpose: Export a single Prisma instance across the backend
// ─────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";

// Avoid hot-reload issues in dev with global instance reuse
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error"], // you can remove "query" in prod
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
