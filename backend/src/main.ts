import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { chatRouter } from "./routes/chat.js";
import { loadIndex } from "./rag/retriever.js";

async function main() {
  const app = express();
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => res.json({ name: "ScholarPath", docs: "/api/health" }));
  app.use("/api", chatRouter);

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
