import { query } from "./db.js";

const rowToTodo = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
});

const getTodoRow = async (id) => {
  const [rows] = await query("SELECT * FROM todos WHERE id = ?", [id]);
  return rows[0] ?? null;
};

export const createTodo = async (userId, { title, description }) => {
  const [result] = await query(
    "INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)",
    [userId, title.trim(), description.trim()]
  );
  const [rows] = await query("SELECT * FROM todos WHERE id = ?", [result.insertId]);
  return rowToTodo(rows[0]);
};

export const listTodos = async (userId, { page, limit, q }) => {
  const offset = (page - 1) * limit;
  const params = [userId];
  let where = "WHERE user_id = ?";

  if (q) {
    const pattern = `%${q}%`;
    where += " AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))";
    params.push(pattern, pattern);
  }

  const [countRows] = await query(`SELECT COUNT(*) AS total FROM todos ${where}`, params);
  const total = countRows[0].total;

  const [rows] = await query(
    `SELECT * FROM todos ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    data: rows.map(rowToTodo),
    page,
    limit,
    total,
  };
};

export const updateTodo = async (userId, id, { title, description }) => {
  const row = await getTodoRow(id);
  if (!row) return { status: "not_found" };
  if (row.user_id !== userId) return { status: "forbidden" };

  await query("UPDATE todos SET title = ?, description = ? WHERE id = ?", [
    title.trim(),
    description.trim(),
    id,
  ]);

  return { status: "ok", todo: rowToTodo({ ...row, title: title.trim(), description: description.trim() }) };
};

export const deleteTodo = async (userId, id) => {
  const row = await getTodoRow(id);
  if (!row) return { status: "not_found" };
  if (row.user_id !== userId) return { status: "forbidden" };

  await query("DELETE FROM todos WHERE id = ?", [id]);
  return { status: "ok" };
};
