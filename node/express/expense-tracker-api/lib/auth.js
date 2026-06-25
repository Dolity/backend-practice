import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export const signToken = (userId, secret, expiresIn) =>
  jwt.sign({ userId }, secret, { expiresIn });

export const verifyToken = (token, secret) => jwt.verify(token, secret);

export const parseAuthHeader = (header) => {
  if (!header) return null;
  return header.startsWith("Bearer ") ? header.slice(7) : header;
};

export const requireAuth = (secret) => (req, res, next) => {
  const token = parseAuthHeader(req.headers.authorization);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = verifyToken(token, secret);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
