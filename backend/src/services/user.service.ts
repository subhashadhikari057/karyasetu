// ─────────────────────────────────────────────
// File: backend/src/services/user.service.ts
// Purpose: create / list / update / delete users
// ─────────────────────────────────────────────

import bcrypt from "bcrypt";
import { prisma } from "../config/db";

/* ----------  CREATE USER  ---------- */
export async function createUser(params: {
  email: string;
  password: string;
  tenantId: string;
  roleIds: string[];
}) {
  const { email, password, tenantId, roleIds } = params;
  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
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
      roles: { include: { role: { select: { name: true } } } },
    },
  });
}

/* ----------  LIST USERS (no pwd)  ---------- */
export async function getAllUsersInTenant(tenantId: string) {
  return prisma.user.findMany({
    where: { tenantId },
    select: {
      id: true,
      email: true,
      roles: { select: { role: { select: { name: true } } } },
    },
  });
}

/* ----------  UPDATE USER  ---------- */
export async function updateUserInTenant(params: {
  userId: string;
  tenantId: string;
  email?: string;
  password?: string;
  roleIds?: string[];
}) {
  const { userId, tenantId, email, password, roleIds } = params;

  // sanity-check ownership
  const exists = await prisma.user.findFirst({ where: { id: userId, tenantId } });
  if (!exists) throw new Error("User not found in tenant");

  const data: { email?: string; password?: string } = {};
  if (email) data.email = email;
  if (password) data.password = await bcrypt.hash(password, 10);

  await prisma.user.update({ where: { id: userId }, data });

  if (roleIds) {
    // reset role links
    await prisma.userRole.deleteMany({ where: { userId } });
    await prisma.userRole.createMany({
      data: roleIds.map((roleId) => ({ userId, roleId })),
      skipDuplicates: true,
    });
  }
}

/* ----------  DELETE USER SAFELY  ---------- */
export async function deleteUserInTenant(userId: string, tenantId: string) {
  // verify user belongs to this tenant
  const target = await prisma.user.findFirst({ where: { id: userId, tenantId } });
  if (!target) throw new Error("User not found in tenant");

  // 1) delete role links
  await prisma.userRole.deleteMany({ where: { userId } });

  // 2) delete refresh tokens (session cleanup)
  await prisma.refreshToken.deleteMany({ where: { userId } });

  // 3) delete the user record itself
  await prisma.user.delete({ where: { id: userId } });
}
