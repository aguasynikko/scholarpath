import { Router, Response } from "express";
import { pool } from "../db/client.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { StudentProfileSchema } from "../types.js";

export const profileRouter = Router();

profileRouter.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    `SELECT gwa, year_level, program, family_income, is_filipino,
            is_athlete, is_alumni_relative, is_faculty_child,
            is_employee_relative, has_sibling_enrolled,
            is_indigenous, is_pwd, hs_honors
     FROM profiles WHERE user_id = $1`,
    [req.userId]
  );

  if (result.rows.length === 0) {
    res.json({});
    return;
  }

  const row = result.rows[0];
  res.json({
    gwa: row.gwa ? Number(row.gwa) : null,
    year_level: row.year_level,
    program: row.program,
    family_income: row.family_income ? Number(row.family_income) : null,
    is_filipino: row.is_filipino,
    is_athlete: row.is_athlete,
    is_alumni_relative: row.is_alumni_relative,
    is_faculty_child: row.is_faculty_child,
    is_employee_relative: row.is_employee_relative,
    has_sibling_enrolled: row.has_sibling_enrolled,
    is_indigenous: row.is_indigenous,
    is_pwd: row.is_pwd,
    hs_honors: row.hs_honors,
  });
});

profileRouter.put("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = StudentProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const p = parsed.data;

  await pool.query(
    `INSERT INTO profiles (user_id, gwa, year_level, program, family_income,
       is_filipino, is_athlete, is_alumni_relative, is_faculty_child,
       is_employee_relative, has_sibling_enrolled, is_indigenous, is_pwd, hs_honors, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,now())
     ON CONFLICT (user_id) DO UPDATE SET
       gwa = EXCLUDED.gwa, year_level = EXCLUDED.year_level,
       program = EXCLUDED.program, family_income = EXCLUDED.family_income,
       is_filipino = EXCLUDED.is_filipino, is_athlete = EXCLUDED.is_athlete,
       is_alumni_relative = EXCLUDED.is_alumni_relative, is_faculty_child = EXCLUDED.is_faculty_child,
       is_employee_relative = EXCLUDED.is_employee_relative, has_sibling_enrolled = EXCLUDED.has_sibling_enrolled,
       is_indigenous = EXCLUDED.is_indigenous, is_pwd = EXCLUDED.is_pwd,
       hs_honors = EXCLUDED.hs_honors, updated_at = now()`,
    [
      req.userId, p.gwa ?? null, p.year_level ?? null, p.program ?? null,
      p.family_income ?? null, p.is_filipino ?? null, p.is_athlete ?? null,
      p.is_alumni_relative ?? null, p.is_faculty_child ?? null,
      p.is_employee_relative ?? null, p.has_sibling_enrolled ?? null,
      p.is_indigenous ?? null, p.is_pwd ?? null, p.hs_honors ?? null,
    ]
  );

  res.json({ ok: true });
});
