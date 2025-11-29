Task Tracker CLI
=================

A simple command-line Task Tracker application built with Node.js. Tasks are stored in a local `task.json` file and can be created, listed, updated, deleted, and marked with different statuses.

## Features

- **Create Task**: Add a new task with a description and default status `todo`.
- **Read Tasks**: Display all tasks stored in `task.json`.
- **Update Task**: Change the `task` description of an existing task by its `id`.
- **Delete Task**: Remove a task by its `id`.
- **Mark Task**: Update the `status` of a task (for example: `todo`, `inprogress`, `completed`).

## Technology Stack

- **Runtime**: Node.js (using ES modules)
- **Standard modules**: `readline`, `fs`
- **Storage**: Local JSON file (`task.json`)

## Requirements

- Node.js installed on your machine (v18+ recommended).

## Installation

1. Clone or download this repository.
2. Open a terminal in the `task-tracker` directory.
3. Make sure `task.json` exists. If not, create it with an empty array:

   ```json
   []
   ```

## Usage

Run the application from the `task-tracker` folder:

```bash
node index.js
```

You will see a menu like this:

```text
Task Tracker
1. Create Task
2. Read Tasks
3. Update Task
4. Delete Task
5. Mark Task
6. Exit
```

Enter the number of the action you want:

- **1 – Create Task**  
  You will be asked to input a task description. The app will append a new task object to `task.json` with an auto-incremented `id` and default `status: "todo"`.

- **2 – Read Tasks**  
  Prints all tasks from `task.json` to the console.

- **3 – Update Task**  
  - First, enter the `id` of the task you want to update.  
  - Then, enter the new task description.  
  The selected task will be updated and written back to `task.json`.

- **4 – Delete Task**  
  - Enter the `id` of the task you want to remove.  
  The app will filter it out from the list and save the remaining tasks to `task.json`.

- **5 – Mark Task**  
  - Enter the `id` of the task.  
  - Enter a new status (for example: `todo`, `inprogress`, `completed`).  
  The task will be updated with the new `status` and saved.

- **6 – Exit**  
  Close the program.

## Data Storage

- All tasks are stored in `task.json` as an array of objects, for example:

  ```json
  [
    { "id": 8, "task": "buy egg", "status": "todo" },
    { "id": 2, "task": "sell the old thing", "status": "completed" }
  ]
  ```

- Each operation (create, update, delete, mark) reads the current contents of `task.json`, modifies the array in memory, and then writes the updated array back to the file.
 
## Reference

- Original project idea from: https://roadmap.sh/projects/task-tracker

