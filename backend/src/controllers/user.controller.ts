// ─────────────────────────────────────────────
// File: backend/src/controllers/user.controller.ts
// Purpose: HTTP handlers for user CRUD inside a tenant
// ─────────────────────────────────────────────

import { Response } from "express";
import { AuthRequest } from "../middlewares/authGuard";
import {
  createUser,
  getAllUsersInTenant,
  updateUserInTenant,
  deleteUserInTenant,
} from "../services/user.service";

/* =====  POST /users  ========================================= */
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
  } catch {
    res.status(500).json({ error: "Failed to create user" });
  }
}

/* =====  GET /users  ========================================== */
export async function listUsersHandler(req: AuthRequest, res: Response): Promise<void> {
  const tenantId = req.user?.tenantId;
  if (!tenantId) { res.status(403).json({ error: "Unauthorized" }); return; }

  try {
    const users = await getAllUsersInTenant(tenantId);
    const formatted = users.map((u: { id: any; email: any; roles: any[]; }) => ({
      id: u.id,
      email: u.email,
      roles: u.roles.map((ur: { role: { name: any; }; }) => ur.role.name),
    }));
    res.status(200).json({ users: formatted });
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

/* =====  PUT /users/:id  ====================================== */
export async function updateUserHandler(req: AuthRequest, res: Response): Promise<void> {
  const tenantId = req.user?.tenantId;
  const userId   = req.params.id;

  if (!tenantId) { res.status(403).json({ error: "Unauthorized" }); return; }

  try {
    await updateUserInTenant({
      userId,
      tenantId,
      email: req.body.email,
      password: req.body.password,
      roleIds: req.body.roleIds,
    });
    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message || "Update failed" });
  }
}

/* =====  DELETE /users/:id  =================================== */
export async function deleteUserHandler(req: AuthRequest, res: Response): Promise<void> {
  const tenantId = req.user?.tenantId;
  const userId   = req.params.id;

  if (!tenantId) { res.status(403).json({ error: "Unauthorized" }); return; }

  try {
    await deleteUserInTenant(userId, tenantId);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message || "Delete failed" });
  }
}
