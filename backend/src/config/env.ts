// ─────────────────────────────────────────────
// File: backend/src/config/env.ts
// Purpose: Load and validate environment variables
// ─────────────────────────────────────────────

import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("8080"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
