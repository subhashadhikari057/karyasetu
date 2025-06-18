// ─────────────────────────────────────────────
// File: backend/src/controllers/user.controller.ts
// Purpose: Handle HTTP requests for user creation/listing
// ─────────────────────────────────────────────

import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authGuard";
import { createUser, getTenantUsers } from "../services/user.service";

export async function createUserHandler(req: AuthRequest, res: Response): Promise<void> {
  const { email, password, roleIds } = req.body;
  const tenantId = req.user?.tenantId;

  if (!email || !password || !roleIds || !tenantId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const user = await createUser({ email, password, roleIds, tenantId });
    res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles.map((r: { role: { name: any; }; }) => r.role.name),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create user" });
  }
}

export async function listUsersHandler(req: AuthRequest, res: Response): Promise<void> {
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }

  try {
    const users = await getTenantUsers(tenantId);
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
}
