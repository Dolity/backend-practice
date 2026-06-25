import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const autoIncrementId = () => {
  try {
    const data = fs.readFileSync("task.json", "utf-8");
    const task = JSON.parse(data);
    return task.length + 1;
  } catch (error) {
    console.error("autoIncrementId Error:", error);
    return 1;
  }
};

const createTask = () => {
  const tasks = readTasks(true);
  let newTask = [];
  rl.question("Adding your task: ", (task) => {
    try {
      newTask = [...tasks, { id: autoIncrementId(), task, status: "todo" }];
      fs.writeFileSync("task.json", JSON.stringify(newTask));
    } catch (error) {
      console.error("createTask Error:", error);
    }
    console.log(newTask);
    app();
  });
};

const readTasks = (isFunctionCall = false) => {
  try {
    const data = fs.readFileSync("task.json", "utf-8");
    if (isFunctionCall) return JSON.parse(data);
    console.log(JSON.parse(data))
    app()
  } catch (error) {
    console.error("readFileJson Error:", error);
    app()
  }
};

const updateTask = () => {
  const tasks = readTasks(true);
  console.log(tasks)
  rl.question("Input id for update task: ", (taskId) => {
    const taskTarget = tasks.find((task) => task.id == taskId)

    if (!taskTarget) {
      console.log("Task not found");
      app();
    }

    rl.question("Input new task: ", (newTask) => {
      const updateTask = tasks.map((task) => (task.id == taskId ? { ...task, task: newTask } : task)) 
      fs.writeFileSync("task.json", JSON.stringify(updateTask));
      console.log(updateTask)
      app();
    })
  })
};

const deleteTask = () => {
  const tasks = readTasks(true);
  console.log(tasks)
  rl.question("Input id for delete task: ", (taskId) => {
    const taskTarget = tasks.find((task) => task.id == taskId)

    if (!taskTarget) {
      console.error("Task not found");
      app()
    }

    const deleteTask = tasks.filter((task) => task.id != taskId)
    fs.writeFileSync("task.json", JSON.stringify(deleteTask));
    console.log(deleteTask)
    app()
  })
};

const markTask = () => {
  const tasks = readTasks(true);
  console.log(tasks)

  rl.question("Input id for mark task: ", (taskId) => {
    const taskTarget = tasks.find((task) => task.id == taskId)

    if (!taskTarget) {
      console.error("Task not found");
    }

    rl.question("Input new status: ", (newStatus) => {
      const newTaskStatus = tasks.map(task => task.id == taskId ? { ...task, status: newStatus } : task)
      fs.writeFileSync("task.json", JSON.stringify(newTaskStatus));
      console.log(newTaskStatus)
      app()
    })
  })
};

const app = () => {
  console.log("Task Tracker");
  console.log("1. Create Task");
  console.log("2. Read Tasks");
  console.log("3. Update Task");
  console.log("4. Delete Task");
  console.log("5. Mark Task");
  console.log("6. Exit");

  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        createTask();
        break;
      case "2":
        readTasks();
        break;
      case "3":
        updateTask();
        break;
      case "4":
        deleteTask();
        break;
      case "5":
        markTask();
        break;
      case "6":
        rl.close();
        break;
    }
  });
};

app();
