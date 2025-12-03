const { program } = require('commander');
const fs = require('fs')

program
  .option('-d, --description <string>')
  .option('-a, --amount <number>')
  .option('--date <string>')
  .option('-i, --id <number>')
  .option('-m --month <string>')
  .argument('<string>');

program.parse();

const options = program.opts();
const input = program.args[0]

const autoIncrementId = (expense) => {
  if (!expense.length) {
    return 1
  }
  return expense[expense.length - 1].id + 1
}

const readFile = (isList) => {
  try {
    const data = fs.readFileSync("expense.json", "utf-8")
    if (!data) {
      return []
    }
    if (isList) {
      console.table(JSON.parse(data))
      return
    }
    return JSON.parse(data)
  } catch (error) {
    console.error("Error cannot read file:", error)
  }
}

const addExpense = () => {
  try {
    const expenses = readFile()
    let id = 0
    id = autoIncrementId(expenses)
    expenses.push({
      id,
      ...options,
    })
    fs.writeFileSync("expense.json", JSON.stringify(expenses))
  } catch (error) {
    console.error("Error cannot add expense:", error)
  }
}

const updateExpense = () => {
  try {
    const expenses = readFile()
    const expenseIndex = expenses.findIndex((expense) => expense.id == options.id)
    if (expenseIndex == -1) {
      return console.error("Expense not found")
    }
    expenses[expenseIndex] = {
      ...expenses[expenseIndex], // old value
      ...options, // if field is the same then it will be replaced
      id: Number(options.id),
    }
    fs.writeFileSync("expense.json", JSON.stringify(expenses))
    console.log("Expense Updated successfully")
  } catch (error) {
    console.error("Error cannot update expense:", error)
  }
}

const deleteExpense = () => {
  try {
    const expenses = readFile()
    const expenseIndex = expenses.findIndex((expense) => expense.id == options.id)
    if (expenseIndex == -1) {
      return console.error("Expense not found")
    }
    expenses.splice(expenseIndex, 1)
    fs.writeFileSync("expense.json", JSON.stringify(expenses))
    console.log("Expense deleted successfully")
  } catch (error) {
    console.error("Error cannot delete expense:", error)
  }
}

const totalExpense = () => {
  try {
    const expenses = readFile()
    if (options.month) {
      const expenseFilted = expenses.filter((expense) => expense.date.includes(options.month))
      const total = expenseFilted.reduce((total, expense) => total + Number(expense.amount), 0)
      console.log(`Total expenses: ${total}`)
      return
    }
    const total = expenses.reduce((total, expense) => total + Number(expense.amount), 0)
    console.log(`Total expenses: ${total}`)
  } catch (error) {
    console.error("Error cannot calculate total expense:", error)
  }
}


switch (input) {
  case "add":
    addExpense()
    break;
  case "list":
    readFile(true)
    break;
  case "update":
    updateExpense()
    break;
  case "delete":
    deleteExpense()
    break;
  case "total":
    totalExpense()
    break;




  default:
    break;
}