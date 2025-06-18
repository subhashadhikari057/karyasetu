import { Request, Response } from "express";
import { loginUser, changePassword } from "../services/auth.service";
import { AuthRequest } from "../middlewares/authGuard";

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const result = await loginUser(email, password);

  if (!result) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.status(200).json(result);
}

export async function changePasswordHandler(req: AuthRequest, res: Response): Promise<void> {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: "Missing old or new password" });
    return;
  }

  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await changePassword(userId, oldPassword, newPassword);
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
