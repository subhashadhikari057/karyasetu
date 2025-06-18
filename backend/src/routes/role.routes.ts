// ─────────────────────────────────────────────
// File: backend/src/routes/role.routes.ts
// Purpose: Expose GET /roles
// ─────────────────────────────────────────────
import { Router } from "express";
import { listRolesHandler } from "../controllers/role.controller";
import { authGuard } from "../middlewares/authGuard";

const router = Router();

/**
 * Route: GET /roles
 * Access: any logged-in user in the tenant
 */
router.get("/", authGuard(), listRolesHandler);

export default router;
