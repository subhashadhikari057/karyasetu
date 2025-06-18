// ─────────────────────────────────────────────
// File: backend/src/controllers/role.controller.ts
// Purpose: Return the list of roles for current tenant
// ─────────────────────────────────────────────
import { Response } from "express";
import { AuthRequest } from "../middlewares/authGuard";
import { getTenantRoles } from "../services/role.service";

export async function listRolesHandler(req: AuthRequest, res: Response): Promise<void> {
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }

  const roles = await getTenantRoles(tenantId);
  res.status(200).json({ roles });
}
