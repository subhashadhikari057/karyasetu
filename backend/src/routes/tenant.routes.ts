// ─────────────────────────────────────────────
// File: backend/src/routes/tenant.routes.ts
// Purpose: Route to allow SUPERADMIN to create new tenants
// ─────────────────────────────────────────────

import { Router } from "express";
import { createTenantHandler } from "../controllers/tenant.controller";
import { authGuard } from "../middlewares/authGuard";
import { permit } from "../middlewares/permit";

const router = Router();

/**
 * Route: POST /tenants
 * Access: SUPERADMIN only (must have TENANT_CREATE permission)
 */
router.post("/", authGuard(), permit("TENANT_CREATE"), createTenantHandler);

export default router;
