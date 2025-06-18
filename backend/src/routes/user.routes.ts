// ─────────────────────────────────────────────
// File: backend/src/routes/user.routes.ts
// Purpose: Expose user creation and listing routes
// ─────────────────────────────────────────────

import { Router } from "express";
import { createUserHandler, listUsersHandler } from "../controllers/user.controller";
import { authGuard } from "../middlewares/authGuard";
import { permit } from "../middlewares/permit";

const router = Router();

/**
 * Route: POST /users
 * Access: Tenant Admin (must have USER_MANAGE_ALL permission)
 */
router.post("/", authGuard(), permit("USER_MANAGE_ALL"), createUserHandler);

/**
 * Route: GET /users
 * Access: Any logged-in tenant user (for simplicity)
 */
router.get("/", authGuard(), listUsersHandler);

export default router;
