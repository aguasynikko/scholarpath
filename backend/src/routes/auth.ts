import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../db/client.js";
import { config } from "../config.js";

export const authRouter = Router();

const RegisterSchema = z.object({
  name: z.string().min(1).max(100),
  studentId: z.string().max(20).optional().default(""),
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

function signToken(userId: string) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: "30d" });
}

authRouter.post("/register", async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const { name, studentId, email, password } = parsed.data;

  const existing = await pool.query(
    "SELECT id FROM users WHERE email = $1 OR (student_id = $2 AND student_id != '')",
    [email, studentId]
  );
  if (existing.rows.length > 0) {
    res.status(409).json({ error: "Email or student ID already registered." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, student_id, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, student_id`,
    [name, studentId || null, email, passwordHash]
  );

  const user = result.rows[0];
  await pool.query("INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT DO NOTHING", [user.id]);

  const token = signToken(user.id);
  res.status(201).json({ token, user: { id: user.id, name: user.name, studentId: user.student_id ?? "" } });
});

authRouter.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  const { identifier, password } = parsed.data;

  const result = await pool.query(
    "SELECT id, name, student_id, password_hash FROM users WHERE email = $1 OR student_id = $1",
    [identifier]
  );

  if (result.rows.length === 0) {
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials." });
    return;
  }

  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, studentId: user.student_id ?? "" } });
});
