// ─────────────────────────────────────────────
// File: backend/src/routes/user.routes.ts
// Purpose: Expose user creation & listing routes
// ─────────────────────────────────────────────

import { Router } from "express";
import {
  createUserHandler,
  listUsersHandler,
  updateUserHandler,
  deleteUserHandler
} from "../controllers/user.controller";
import { authGuard } from "../middlewares/authGuard";
import { permit } from "../middlewares/permit";

const router = Router();

/** POST /users — create user (needs USER_MANAGE_ALL) */
router.post("/", authGuard(), permit("USER_MANAGE_ALL"), createUserHandler);

/** GET /users — list all users in tenant */
router.get("/", authGuard(), listUsersHandler);

/* create & list already here … */

/** PUT /users/:id */
router.put("/:id", authGuard(), permit("USER_MANAGE_ALL"), updateUserHandler);

/** DELETE /users/:id */
router.delete("/:id", authGuard(), permit("USER_MANAGE_ALL"), deleteUserHandler);


export default router;
