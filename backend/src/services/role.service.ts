// ─────────────────────────────────────────────
// File: backend/src/services/role.service.ts
// Purpose: Fetch roles for a specific tenant
// ─────────────────────────────────────────────
import { prisma } from "../config/db";

export async function getTenantRoles(tenantId: string) {
  return prisma.role.findMany({
    where: { tenantId },
    select: {
      id: true,
      name: true,
    },
  });
}
