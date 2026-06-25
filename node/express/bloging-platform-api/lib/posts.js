import { query } from "./db.js";

const rowToPost = (row) => ({
  id: row.id,
  title: row.title,
  content: row.content,
  category: row.category,
  tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});

export const createPost = async ({ title, content, category, tags }) => {
  const [result] = await query(
    "INSERT INTO posts (title, content, category, tags) VALUES (?, ?, ?, ?)",
    [title.trim(), content.trim(), category.trim(), JSON.stringify(tags)]
  );
  return getPostById(result.insertId);
};

export const getPostById = async (id) => {
  const [rows] = await query("SELECT * FROM posts WHERE id = ?", [id]);
  return rows[0] ? rowToPost(rows[0]) : null;
};

export const getAllPosts = async () => {
  const [rows] = await query("SELECT * FROM posts ORDER BY created_at DESC");
  return rows.map(rowToPost);
};

export const searchPosts = async (term) => {
  const pattern = `%${term}%`;
  const [rows] = await query(
    `SELECT * FROM posts
     WHERE LOWER(title) LIKE LOWER(?)
        OR LOWER(content) LIKE LOWER(?)
        OR LOWER(category) LIKE LOWER(?)
     ORDER BY created_at DESC`,
    [pattern, pattern, pattern]
  );
  return rows.map(rowToPost);
};

export const updatePost = async (id, { title, content, category, tags }) => {
  const [result] = await query(
    "UPDATE posts SET title = ?, content = ?, category = ?, tags = ? WHERE id = ?",
    [title.trim(), content.trim(), category.trim(), JSON.stringify(tags), id]
  );
  if (result.affectedRows === 0) return null;
  return getPostById(id);
};

export const deletePost = async (id) => {
  const [result] = await query("DELETE FROM posts WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
