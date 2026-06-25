import "dotenv/config";
import express from "express";
import { connectDb } from "./lib/db.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  searchPosts,
  updatePost,
} from "./lib/posts.js";
import { validatePost } from "./lib/validate.js";

const PORT = Number(process.env.PORT) || 3000;

const parseId = (raw) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
};

const app = express();
app.use(express.json());

app.post("/posts", async (req, res) => {
  const errors = validatePost(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const post = await createPost(req.body);
  res.status(201).json(post);
});

app.get("/posts", async (req, res) => {
  const term = req.query.term?.trim();
  const posts = term ? await searchPosts(term) : await getAllPosts();
  res.json(posts);
});

app.get("/posts/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ error: "Post not found" });

  const post = await getPostById(id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

app.put("/posts/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ error: "Post not found" });

  const errors = validatePost(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const post = await updatePost(id, req.body);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ error: "Post not found" });

  const deleted = await deletePost(id);
  if (!deleted) return res.status(404).json({ error: "Post not found" });
  res.status(204).send();
});

try {
  await connectDb({
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || "blog",
    password: process.env.MYSQL_PASSWORD || "blog",
    database: process.env.MYSQL_DATABASE || "blog",
  });
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Blogging Platform API running at http://localhost:${PORT}`);
});
