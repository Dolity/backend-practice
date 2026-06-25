import { query } from "./db.js";
import { comparePassword, hashPassword, signToken } from "./auth.js";

export class DuplicateEmailError extends Error {
  constructor() {
    super("Email already registered");
    this.code = "DUPLICATE_EMAIL";
  }
}

const findByEmail = async (email) => {
  const [rows] = await query("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
  return rows[0] ?? null;
};

export const registerUser = async ({ name, email, password }, jwtSecret, jwtExpiresIn) => {
  const normalizedEmail = email.trim().toLowerCase();
  if (await findByEmail(normalizedEmail)) throw new DuplicateEmailError();

  const passwordHash = await hashPassword(password);
  const [result] = await query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name.trim(), normalizedEmail, passwordHash]
  );

  const token = signToken(result.insertId, jwtSecret, jwtExpiresIn);
  return { token };
};

export const loginUser = async ({ email, password }, jwtSecret, jwtExpiresIn) => {
  const user = await findByEmail(email);
  if (!user) return null;

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) return null;

  const token = signToken(user.id, jwtSecret, jwtExpiresIn);
  return { token };
};
