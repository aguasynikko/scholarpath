import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
// @ts-expect-error - no types shipped
import bm25Factory from "wink-bm25-text-search";
// @ts-expect-error - no types shipped
import nlpUtils from "wink-nlp-utils";
import { config } from "../config.js";
import type { Chunk, Citation } from "../types.js";

const prepTask = [
  nlpUtils.string.lowerCase,
  nlpUtils.string.removeExtraSpaces,
  nlpUtils.string.tokenize0,
  nlpUtils.tokens.removeWords,
  nlpUtils.tokens.stem,
];

let chunks: Chunk[] = [];
let engine: any = null;

export async function loadIndex(): Promise<void> {
  const path = resolve(config.indexPath);
  const raw = await readFile(path, "utf8");
  chunks = JSON.parse(raw) as Chunk[];

  engine = bm25Factory();
  engine.defineConfig({ fldWeights: { text: 1 } });
  engine.definePrepTasks(prepTask);

  for (const c of chunks) {
    engine.addDoc({ text: c.text }, c.id);
  }
  engine.consolidate();

  console.log(`[retriever] loaded ${chunks.length} chunks`);
}

export function search(query: string, k = 5): (Chunk & { score: number })[] {
  if (!engine) throw new Error("Index not loaded. Call loadIndex() first.");
  const results: [string, number][] = engine.search(query, k);
  if (!results.length) return [];

  const maxScore = results[0][1] || 1;
  return results.map(([id, score]) => {
    const chunk = chunks.find((c) => c.id === id)!;
    return { ...chunk, score: score / maxScore };
  });
}

export function toCitations(hits: (Chunk & { score: number })[]): Citation[] {
  return hits.map((h) => ({
    page: h.page,
    snippet: h.text.slice(0, 200),
    score: Number(h.score.toFixed(3)),
  }));
}

export function indexSize(): number {
  return chunks.length;
}
