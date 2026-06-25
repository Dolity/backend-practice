import "dotenv/config";
import express from "express";
import { requireAuth } from "./lib/auth.js";
import { connectDb } from "./lib/db.js";
import { createExpense, deleteExpense, listExpenses, updateExpense } from "./lib/expenses.js";
import { DuplicateEmailError, loginUser, registerUser } from "./lib/users.js";
import { validateExpense, validateLogin, validatePeriod, validateRegister } from "./lib/validate.js";

const PORT = Number(process.env.PORT) || 3002;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  console.error("JWT_SECRET is required. Copy .env.example to .env and set a secret.");
  process.exit(1);
}

const parseId = (raw) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
};

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  const errors = validateRegister(req.body);
  if (errors.length) return res.status(400).json({ errors });

  try {
    const result = await registerUser(req.body, JWT_SECRET, JWT_EXPIRES_IN);
    res.json(result);
  } catch (err) {
    if (err instanceof DuplicateEmailError) {
      return res.status(409).json({ error: "Email already registered" });
    }
    throw err;
  }
});

app.post("/login", async (req, res) => {
  const errors = validateLogin(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const result = await loginUser(req.body, JWT_SECRET, JWT_EXPIRES_IN);
  if (!result) return res.status(401).json({ message: "Unauthorized" });
  res.json(result);
});

app.use("/expenses", requireAuth(JWT_SECRET));

app.post("/expenses", async (req, res) => {
  const errors = validateExpense(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const expense = await createExpense(req.userId, {
    ...req.body,
    amount: Number(req.body.amount),
  });
  res.status(201).json(expense);
});

app.get("/expenses", async (req, res) => {
  const period = req.query.period?.trim() || "";
  const startDate = req.query.startDate?.trim() || "";
  const endDate = req.query.endDate?.trim() || "";

  const errors = validatePeriod(period, startDate, endDate);
  if (errors.length) return res.status(400).json({ errors });

  const expenses = await listExpenses(req.userId, { period, startDate, endDate });
  res.json(expenses);
});

app.put("/expenses/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ error: "Expense not found" });

  const errors = validateExpense(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const result = await updateExpense(req.userId, id, {
    ...req.body,
    amount: Number(req.body.amount),
  });
  if (result.status === "not_found") return res.status(404).json({ error: "Expense not found" });
  if (result.status === "forbidden") return res.status(403).json({ message: "Forbidden" });
  res.json(result.expense);
});

app.delete("/expenses/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ error: "Expense not found" });

  const result = await deleteExpense(req.userId, id);
  if (result.status === "not_found") return res.status(404).json({ error: "Expense not found" });
  if (result.status === "forbidden") return res.status(403).json({ message: "Forbidden" });
  res.status(204).send();
});

try {
  await connectDb({
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3308,
    user: process.env.MYSQL_USER || "expense",
    password: process.env.MYSQL_PASSWORD || "expense",
    database: process.env.MYSQL_DATABASE || "expense",
  });
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Expense Tracker API running at http://localhost:${PORT}`);
});
