# GitHub User Activity (CLI)

A simple Node.js command‑line application to view recent GitHub activity events for the user `dolity`.

The app calls the public GitHub Events API and lets you choose between **all events** and **public events only**.

## Requirements

- Node.js **18+** (for built‑in `fetch` support)

## Installation

1. Clone or download this repository.
2. Open a terminal in the `github-user-activity` directory.

No extra npm packages are required because the script only uses Node’s built‑in modules and global `fetch` (Node 18+).

## Usage

In the project directory, run:

```bash
node index.js
```

You will see a menu like:

```text
GitHub User Activity
1. Get user activity event
2. Get user activity event public
3. Exit
```

Enter a number:

- `1` – Fetch all events for user `dolity`.
- `2` – Fetch only public events for user `dolity`.
- `3` – Exit the program.

The raw JSON response from GitHub will be printed to the console.

## Notes

- This script is hard‑coded to use the GitHub username `dolity`. To use another username, change the URL in `index.js`.
- The app uses the **unauthenticated** GitHub API. If you run it many times in a short period, you may hit GitHub’s rate limit.

## Reference

- Original project idea from: https://roadmap.sh/projects/github-user-activity