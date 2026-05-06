import "dotenv/config";

export const config = {
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  port: Number(process.env.PORT ?? 8000),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  handbookPath: process.env.HANDBOOK_PATH ?? "./data/scholarshiphandbook.pdf",
  indexPath: process.env.INDEX_PATH ?? "./data/chunks.json",
};

if (!config.groqApiKey) {
  console.warn("[config] GROQ_API_KEY is empty — chat endpoint will fail until set in .env");
}
