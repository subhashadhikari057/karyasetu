// ─────────────────────────────────────────────
// File: backend/src/controllers/tenant.controller.ts
// ─────────────────────────────────────────────

import { Request, Response } from "express";
import { createTenantWithAdmin } from "../services/tenant.service";

export async function createTenantHandler(req: Request, res: Response): Promise<void> {
  try {
    const { name, slug, adminEmail, adminPassword } = req.body;

    if (!name || !slug || !adminEmail) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const result = await createTenantWithAdmin({
      name,
      slug,
      adminEmail,
      adminPassword,
    });

    res.status(201).json({
      message: "Tenant created successfully",
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug,
      },
      admin: {
        id: result.adminUser.id,
        email: result.adminUser.email,
        tempPassword: result.plainPassword,
      },
    });
  } catch (error) {
    console.error("❌ Error creating tenant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
