import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./lib/articles.js";
import { requireAuth } from "./middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "ponytail-dev",
    resave: false,
    saveUninitialized: false,
  })
);

// --- Guest routes ---

app.get("/", async (req, res) => {
  const articles = await listArticles();
  res.render("home", { articles, isAdmin: !!req.session?.admin });
});

app.get("/articles/:slug", async (req, res) => {
  const article = await getArticle(req.params.slug);
  if (!article) return res.status(404).render("admin/error", { message: "Article not found." });
  res.render("article", { article, isAdmin: !!req.session?.admin });
});

// --- Auth routes ---

app.get("/admin/login", (req, res) => {
  if (req.session?.admin) return res.redirect("/admin");
  res.render("login", { error: null });
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.admin = true;
    return res.redirect("/admin");
  }
  res.render("login", { error: "Invalid username or password." });
});

app.post("/admin/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// --- Admin routes ---

app.get("/admin", requireAuth, async (req, res) => {
  const articles = await listArticles();
  res.render("admin/dashboard", { articles });
});

app.get("/admin/articles/new", requireAuth, (req, res) => {
  res.render("admin/form", {
    article: null,
    action: "/admin/articles",
    method: "post",
    heading: "Add Article",
  });
});

app.post("/admin/articles", requireAuth, async (req, res) => {
  const { title, content, publishedAt } = req.body;
  if (!title?.trim() || !content?.trim() || !publishedAt) {
    return res.status(400).render("admin/form", {
      article: req.body,
      action: "/admin/articles",
      method: "post",
      heading: "Add Article",
      error: "All fields are required.",
    });
  }
  const article = await createArticle({ title: title.trim(), content, publishedAt });
  res.redirect(`/admin/articles/${article.slug}/edit?saved=1`);
});

app.get("/admin/articles/:slug/edit", requireAuth, async (req, res) => {
  const article = await getArticle(req.params.slug);
  if (!article) return res.status(404).render("admin/error", { message: "Article not found." });
  res.render("admin/form", {
    article,
    action: `/admin/articles/${article.slug}`,
    method: "post",
    heading: "Edit Article",
    saved: req.query.saved === "1",
  });
});

app.post("/admin/articles/:slug", requireAuth, async (req, res) => {
  const { title, content, publishedAt } = req.body;
  if (!title?.trim() || !content?.trim() || !publishedAt) {
    const article = await getArticle(req.params.slug);
    return res.status(400).render("admin/form", {
      article: { ...article, ...req.body },
      action: `/admin/articles/${req.params.slug}`,
      method: "post",
      heading: "Edit Article",
      error: "All fields are required.",
    });
  }
  const result = await updateArticle(req.params.slug, {
    title: title.trim(),
    content,
    publishedAt,
  });
  if (!result) return res.status(404).render("admin/error", { message: "Article not found." });
  if (result.error) {
    const article = await getArticle(req.params.slug);
    return res.status(400).render("admin/form", {
      article: { ...article, title, content, publishedAt },
      action: `/admin/articles/${req.params.slug}`,
      method: "post",
      heading: "Edit Article",
      error: result.error,
    });
  }
  res.redirect(`/admin/articles/${result.slug}/edit?saved=1`);
});

app.post("/admin/articles/:slug/delete", requireAuth, async (req, res) => {
  await deleteArticle(req.params.slug);
  res.redirect("/admin");
});

app.listen(PORT, () => {
  console.log(`Personal Blog running at http://localhost:${PORT}`);
});
