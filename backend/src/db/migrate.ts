import { pool } from "./client.js";

export async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT NOT NULL,
      student_id  TEXT UNIQUE,
      email       TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS profiles (
      user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      gwa               NUMERIC(4,2),
      year_level        TEXT,
      program           TEXT,
      family_income     NUMERIC(12,2),
      is_filipino       BOOLEAN,
      is_athlete        BOOLEAN,
      is_alumni_relative BOOLEAN,
      is_faculty_child  BOOLEAN,
      is_employee_relative BOOLEAN,
      has_sibling_enrolled BOOLEAN,
      is_indigenous     BOOLEAN,
      is_pwd            BOOLEAN,
      hs_honors         TEXT,
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS chat_history (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content    TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS chat_history_user_id_idx ON chat_history(user_id, created_at);
  `);

  console.log("[migrate] tables ready");
}
