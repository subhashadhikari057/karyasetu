// ─────────────────────────────────────────────
// File: backend/src/services/auth.service.ts
// Purpose: Login + password change  (strict-TS clean)
// ─────────────────────────────────────────────

import bcrypt from "bcrypt";
import { prisma } from "../config/db";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./token.service";

/**
 * Log a user in with email + password.
 * Returns tokens or null on failure.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<
  | {
      accessToken: string;
      refreshToken: string;
      mustChangePassword: boolean;
    }
  | null
> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  // ── Flatten role IDs & permission codes (explicit loops = no implicit any)
  const roleIds: string[] = [];
  const permissions: string[] = [];

  for (const roleLink of user.roles) {
    roleIds.push(roleLink.roleId);

    for (const permLink of roleLink.role.permissions) {
      permissions.push(permLink.permission.code);
    }
  }

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    tenantId: user.tenantId,
    roleIds,
    permissions,
  });

  const { token: refreshToken, expiresAt } = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    mustChangePassword: user.mustChangePassword,
  };
}

/**
 * Change a user's password (old → new).
 */
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) throw new Error("Incorrect current password");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashed,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    },
  });
}
