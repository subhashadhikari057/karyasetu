// ─────────────────────────────────────────────
// File: backend/prisma/seed.ts
// Purpose: Seed permissions, SUPERADMIN role, and 1 user
// ─────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const defaultPermissions = [
  { code: "TENANT_CREATE", description: "Create new tenant" },
  { code: "USER_MANAGE_ALL", description: "Manage all users" },
  { code: "ROLE_MANAGE_ALL", description: "Manage all roles" },
  { code: "VIEW_ALL_TENANTS", description: "See all tenants" },
  { code: "VIEW_ALL_USERS", description: "See all users" },
  { code: "DASHBOARD_ACCESS", description: "Access main dashboard" },
];

async function main() {
  console.log("🌱 Seeding permissions...");

  for (const perm of defaultPermissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }

  console.log("✅ Permissions seeded");

  // Get all permission IDs
  const allPermissions = await prisma.permission.findMany();

  // Create SUPERADMIN role
  const superadminRole = await prisma.role.create({
    data: {
      name: "SUPERADMIN",
      isSystem: true,
      permissions: {
        create: allPermissions.map((perm: { id: any; }) => ({
          permission: { connect: { id: perm.id } },
        })),
      },
    },
  });

  console.log("🔐 SUPERADMIN role created");

  // Create SUPERADMIN user
  const email = "admin@karyasetu.com";
  const plainPassword = "SuperSecure123";

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (!userExists) {
    const hashed = await bcrypt.hash(plainPassword, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        mustChangePassword: true,
        roles: {
          create: {
            roleId: superadminRole.id,
          },
        },
      },
    });

    console.log(`👤 Superadmin created: ${email}`);
    console.log(`🔑 Temp password: ${plainPassword}`);
  } else {
    console.log("ℹ️ Superadmin user already exists");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
