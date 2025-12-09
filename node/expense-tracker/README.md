# Expense Tracker (CLI)

A simple Node.js command‑line application for tracking expenses in a JSON file. 
You can add, list, update, delete, and calculate totals for your expenses.

## Features

- **Add** a new expense with description, amount, and date
- **List** all expenses in a nice console table
- **Update** an existing expense by ID
- **Delete** an expense by ID
- **Total** expenses overall or filtered by month

All data is stored in `expense.json` as an array of expense objects.

## Requirements

- Node.js or Bun (you are currently using Bun)
- No extra npm packages are required besides `commander`

## Installation

1. Go to the project directory:

   ```bash
   cd expense-tracker
   ```

2. Install dependencies (if you have a `package.json` with commander):

   ```bash
   npm install
   # or
   bun install
   ```

## Usage

General format:

```bash
bun index.js <command> [options]
# or
node index.js <command> [options]
```

### 1. Add an expense

```bash
bun index.js add -d <description> -a <amount> --date <YYYY-MM-DD>
```

Example:

```bash
bun index.js add -d oil -a 100 --date 2025-12-01
```

### 2. List all expenses

```bash
bun index.js list
```

This prints a table with columns: `id`, `description`, `amount`, `date`.

### 3. Update an expense

```bash
bun index.js update -i <id> [--description <text>] [--amount <number>] [--date <YYYY-MM-DD>]
```

Example:

```bash
bun index.js update -i 2 --description "oil" --amount 150 --date 2025-12-02
```

Only the fields you provide will be updated; other fields keep their old values.

### 4. Delete an expense

```bash
bun index.js delete -i <id>
```

Example:

```bash
bun index.js delete -i 3
```

### 5. Show total expenses

- **All expenses:**

  ```bash
  bun index.js total
  ```

- **Filter by month:** (using the `-m` option and a month string contained in the date, e.g. `11` or `12`)

  ```bash
  bun index.js total -m 11
  bun index.js total -m 12
  ```

The script sums `amount` fields (converted to numbers) and prints the total.

## Data format

`expense.json` contains an array like:

```json
[
  {
    "id": 1,
    "description": "oil",
    "amount": "100",
    "date": "2025-12-01"
  }
]
```

- `id` is an auto-incrementing number.
- `amount` is stored as a string in JSON but converted with `Number()` when calculating totals.

## Notes

- Be careful when editing `expense.json` manually; invalid JSON will break the CLI.
- The `-m` / `--month` filter currently uses `String.includes` on the `date` string.
  For example, `-m 11` matches dates containing `"11"` such as `"2025-11-01"`.

## Reference

- Original project idea from: https://roadmap.sh/projects/expense-tracker