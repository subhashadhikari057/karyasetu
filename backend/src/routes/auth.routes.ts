import { Router } from "express";
import { loginHandler } from "../controllers/auth.controller";
import { authGuard } from "../middlewares/authGuard";
import { changePasswordHandler } from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginHandler);

export default router;


router.post("/change-password", authGuard(), changePasswordHandler);