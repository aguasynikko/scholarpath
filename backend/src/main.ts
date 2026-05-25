import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { chatRouter } from "./routes/chat.js";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { loadIndex } from "./rag/retriever.js";
import { runMigrations } from "./db/migrate.js";

async function main() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.options("*", cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => res.json({ name: "ScholarPath", docs: "/api/health" }));
  app.use("/api", chatRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/profile", profileRouter);

  try {
    await runMigrations();
  } catch (err: any) {
    console.warn(`[main] DB migration failed: ${err.message}`);
  }

  try {
    await loadIndex();
  } catch (err: any) {
    console.warn(`[main] index not loaded: ${err.message}`);
    console.warn("[main] run `npm run ingest` to build it");
  }

  app.listen(config.port, () => {
    console.log(`[main] ScholarPath API listening on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error("[main] fatal:", err);
  process.exit(1);
});
