import "dotenv/config";
import express from "express";
import { requireAuth } from "./lib/auth.js";
import { connectDb } from "./lib/db.js";
import { createTodo, deleteTodo, listTodos, updateTodo } from "./lib/todos.js";
import { DuplicateEmailError, loginUser, registerUser } from "./lib/users.js";
import { validateLogin, validateRegister, validateTodo } from "./lib/validate.js";

const PORT = Number(process.env.PORT) || 3001;
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

app.use("/todos", requireAuth(JWT_SECRET));

app.post("/todos", async (req, res) => {
  const errors = validateTodo(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const todo = await createTodo(req.userId, req.body);
  res.status(201).json(todo);
});

app.get("/todos", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const q = req.query.q?.trim() || "";

  const result = await listTodos(req.userId, { page, limit, q });
  res.json(result);
});

app.put("/todos/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ error: "Todo not found" });

  const errors = validateTodo(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const result = await updateTodo(req.userId, id, req.body);
  if (result.status === "not_found") return res.status(404).json({ error: "Todo not found" });
  if (result.status === "forbidden") return res.status(403).json({ message: "Forbidden" });
  res.json(result.todo);
});

app.delete("/todos/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ error: "Todo not found" });

  const result = await deleteTodo(req.userId, id);
  if (result.status === "not_found") return res.status(404).json({ error: "Todo not found" });
  if (result.status === "forbidden") return res.status(403).json({ message: "Forbidden" });
  res.status(204).send();
});

try {
  await connectDb({
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3307,
    user: process.env.MYSQL_USER || "todo",
    password: process.env.MYSQL_PASSWORD || "todo",
    database: process.env.MYSQL_DATABASE || "todo",
  });
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Todo List API running at http://localhost:${PORT}`);
});
