import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthUser {
  id: string;
  email: string;
  tenantId?: string | null;
  roleIds: string[];
  permissions: string[];
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function authGuard(): RequestHandler {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or invalid token" });
      return; // <── ensures function returns void
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
