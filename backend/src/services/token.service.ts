// ─────────────────────────────────────────────
// File: backend/src/services/token.service.ts
// Purpose: Handle access & refresh token creation + validation
// ─────────────────────────────────────────────

import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  id: string;
  email: string;
  tenantId?: string | null;
  roleIds: string[];
  permissions: string[];
}

// Access token: short-lived, returned in API responses
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "15m",
  });
}

// Refresh token: long-lived, stored in secure cookie
export function generateRefreshToken(): { token: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const token = jwt.sign({}, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, expiresAt };
}

// Decode token manually (used in refresh/guard logic)
export function decodeToken<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as T;
  } catch {
    return null;
  }
}
