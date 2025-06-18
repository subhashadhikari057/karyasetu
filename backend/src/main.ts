// ─────────────────────────────────────────────
// File: backend/src/main.ts
// Purpose: Start Express server + mount routes
// ─────────────────────────────────────────────

import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { prisma } from "./config/db";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";

// ── Routes ──
import tenantRoutes from "./routes/tenant.routes";

config(); // Load .env

const app = express();
const PORT = env.PORT || 8080;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Routes ──
app.use("/auth", authRoutes);
app.use("/tenants", tenantRoutes);

app.get("/health", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connected");
    res.send("✅ Server is healthy");
  } catch {
    res.status(500).send("❌ DB connection failed");
  }
});

// ── Start ──
app.listen(PORT, () => {
  console.log(`🚀 Karyasetu backend running at http://localhost:${PORT}`);
});
