// backend/src/main.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/db";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// ── Startup: test DB, then start server ──────────────────────────
(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅  Database connected");
  } catch (err) {
    console.error("❌  Database connection FAILED:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀  Server running on port ${PORT}`);
  });
})();
