import { query } from "./db.js";

const rowToExpense = (row) => ({
  id: row.id,
  description: row.description,
  amount: Number(row.amount),
  category: row.category,
  date: row.expense_date.toISOString().slice(0, 10),
});

const getExpenseRow = async (id) => {
  const [rows] = await query("SELECT * FROM expenses WHERE id = ?", [id]);
  return rows[0] ?? null;
};

export const buildDateClause = (period, startDate, endDate) => {
  if (!period) return { sql: "", params: [] };

  switch (period) {
    case "week":
      return { sql: " AND expense_date >= CURDATE() - INTERVAL 7 DAY", params: [] };
    case "month":
      return { sql: " AND expense_date >= CURDATE() - INTERVAL 1 MONTH", params: [] };
    case "3months":
      return { sql: " AND expense_date >= CURDATE() - INTERVAL 3 MONTH", params: [] };
    case "custom":
      return {
        sql: " AND expense_date BETWEEN ? AND ?",
        params: [startDate.trim(), endDate.trim()],
      };
    default:
      return { sql: "", params: [] };
  }
};

export const createExpense = async (userId, { description, amount, category, date }) => {
  const [result] = await query(
    "INSERT INTO expenses (user_id, description, amount, category, expense_date) VALUES (?, ?, ?, ?, ?)",
    [userId, description.trim(), amount, category, date.trim()]
  );
  const [rows] = await query("SELECT * FROM expenses WHERE id = ?", [result.insertId]);
  return rowToExpense(rows[0]);
};

export const listExpenses = async (userId, { period, startDate, endDate }) => {
  const { sql, params } = buildDateClause(period, startDate, endDate);
  const [rows] = await query(
    `SELECT * FROM expenses WHERE user_id = ?${sql} ORDER BY expense_date DESC`,
    [userId, ...params]
  );
  return rows.map(rowToExpense);
};

export const updateExpense = async (userId, id, { description, amount, category, date }) => {
  const row = await getExpenseRow(id);
  if (!row) return { status: "not_found" };
  if (row.user_id !== userId) return { status: "forbidden" };

  await query(
    "UPDATE expenses SET description = ?, amount = ?, category = ?, expense_date = ? WHERE id = ?",
    [description.trim(), amount, category, date.trim(), id]
  );

  const [rows] = await query("SELECT * FROM expenses WHERE id = ?", [id]);
  return { status: "ok", expense: rowToExpense(rows[0]) };
};

export const deleteExpense = async (userId, id) => {
  const row = await getExpenseRow(id);
  if (!row) return { status: "not_found" };
  if (row.user_id !== userId) return { status: "forbidden" };

  await query("DELETE FROM expenses WHERE id = ?", [id]);
  return { status: "ok" };
};
