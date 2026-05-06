import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import pdfParse from "pdf-parse";
import { config } from "../config.js";
import type { Chunk } from "../types.js";

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 120;

function chunkText(text: string, page: number, idStart: number): Chunk[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const chunks: Chunk[] = [];
  let i = 0;
  let n = idStart;
  while (i < cleaned.length) {
    const end = Math.min(i + CHUNK_SIZE, cleaned.length);
    let slice = cleaned.slice(i, end);
    if (end < cleaned.length) {
      const lastPeriod = slice.lastIndexOf(". ");
      if (lastPeriod > CHUNK_SIZE * 0.5) {
        slice = slice.slice(0, lastPeriod + 1);
      }
    }
    chunks.push({ id: `c${n++}`, page, text: slice.trim() });
    const advance = slice.length - CHUNK_OVERLAP;
    i += advance > 0 ? advance : slice.length;
  }
  return chunks;
}

async function main() {
  const pdfPath = resolve(config.handbookPath);
  console.log(`[ingest] reading ${pdfPath}`);
  const buf = await readFile(pdfPath);

  const parsed = await pdfParse(buf);
  console.log(`[ingest] pages: ${parsed.numpages}, total chars: ${parsed.text.length}`);

  // pdf-parse joins pages with double-newline by default; we approximate per-page split by
  // dividing total text by page count when no form-feed separators are present.
  const pageTexts = parsed.text.includes("\f")
    ? parsed.text.split("\f")
    : splitEvenly(parsed.text, parsed.numpages);

  const allChunks: Chunk[] = [];
  pageTexts.forEach((pageText, idx) => {
    const newChunks = chunkText(pageText, idx + 1, allChunks.length);
    allChunks.push(...newChunks);
  });

  console.log(`[ingest] chunks: ${allChunks.length}`);

  const out = resolve(config.indexPath);
  await writeFile(out, JSON.stringify(allChunks));
  const sizeKB = (JSON.stringify(allChunks).length / 1024).toFixed(1);
  console.log(`[ingest] wrote ${out} (${sizeKB} KB)`);
}

function splitEvenly(text: string, parts: number): string[] {
  if (parts <= 1) return [text];
  const size = Math.ceil(text.length / parts);
  const out: string[] = [];
  for (let i = 0; i < parts; i++) {
    out.push(text.slice(i * size, (i + 1) * size));
  }
  return out;
}

main().catch((err) => {
  console.error("[ingest] failed:", err);
  process.exit(1);
});
