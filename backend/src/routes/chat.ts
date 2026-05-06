import { Router } from "express";
import { ChatRequestSchema } from "../types.js";
import { answer } from "../rag/chain.js";
import { indexSize } from "../rag/retriever.js";

export const chatRouter: Router = Router();

chatRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", indexed_chunks: indexSize() });
});

chatRouter.post("/chat", async (req, res) => {
  const parsed = ChatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", issues: parsed.error.issues });
  }
  if (indexSize() === 0) {
    return res.status(503).json({ error: "Index empty. Run `npm run ingest` first." });
  }

  try {
    const result = await answer(parsed.data.message, parsed.data.profile, parsed.data.history);
    res.json(result);
  } catch (err: any) {
    console.error("[chat] error:", err);
    res.status(500).json({ error: err?.message ?? "Internal error" });
  }
});
