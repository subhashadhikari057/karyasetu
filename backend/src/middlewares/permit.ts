import { Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "./authGuard";

export function permit(...requiredPermissions: string[]): RequestHandler {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const ok = user.permissions.some((p) =>
      requiredPermissions.includes(p)
    );

    if (!ok) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}
