import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, "..", "articles");

export const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const readArticleFile = async (filename) => {
  const raw = await fs.readFile(path.join(ARTICLES_DIR, filename), "utf-8");
  return JSON.parse(raw);
};

export const listArticles = async () => {
  let files;
  try {
    files = await fs.readdir(ARTICLES_DIR);
  } catch {
    return [];
  }

  const articles = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => readArticleFile(f))
  );

  return articles.sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
};

export const getArticle = async (slug) => {
  try {
    return await readArticleFile(`${slug}.json`);
  } catch {
    return null;
  }
};

const uniqueSlug = async (base) => {
  let slug = base;
  let n = 1;
  while (await getArticle(slug)) {
    slug = `${base}-${n++}`;
  }
  return slug;
};

export const createArticle = async ({ title, content, publishedAt }) => {
  const base = slugify(title) || "untitled";
  const slug = await uniqueSlug(base);
  const article = { slug, title, content, publishedAt };
  await fs.writeFile(
    path.join(ARTICLES_DIR, `${slug}.json`),
    JSON.stringify(article, null, 2)
  );
  return article;
};

export const updateArticle = async (oldSlug, { title, content, publishedAt }) => {
  const existing = await getArticle(oldSlug);
  if (!existing) return null;

  const newBase = slugify(title) || oldSlug;
  let slug = newBase;
  if (slug !== oldSlug && (await getArticle(slug))) {
    return { error: "An article with this title already exists." };
  }

  const article = { slug, title, content, publishedAt };
  if (slug !== oldSlug) {
    await fs.unlink(path.join(ARTICLES_DIR, `${oldSlug}.json`));
  }
  await fs.writeFile(
    path.join(ARTICLES_DIR, `${slug}.json`),
    JSON.stringify(article, null, 2)
  );
  return article;
};

export const deleteArticle = async (slug) => {
  try {
    await fs.unlink(path.join(ARTICLES_DIR, `${slug}.json`));
    return true;
  } catch {
    return false;
  }
};
