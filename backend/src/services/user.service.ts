// ─────────────────────────────────────────────
// File: backend/src/services/user.service.ts
// Purpose: Tenant Admin can create/update/list users
// ─────────────────────────────────────────────

import bcrypt from "bcrypt";
import { prisma } from "../config/db";

export async function createUser(params: {
  email: string;
  password: string;
  tenantId: string;
  roleIds: string[];
}) {
  const { email, password, tenantId, roleIds } = params;

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      tenantId,
      mustChangePassword: true,
      roles: {
        create: roleIds.map((roleId) => ({ roleId })),
      },
    },
    include: {
      roles: { include: { role: true } },
    },
  });

  return user;
}

export async function getTenantUsers(tenantId: string) {
  return prisma.user.findMany({
    where: { tenantId },
    include: {
      roles: { include: { role: true } },
    },
  });
}
