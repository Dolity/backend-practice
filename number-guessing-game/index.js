import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 100) + 1
}

const findAttempts = (level) => {
  const mapAttempts = {
    easy: 10,
    medium: 5,
    hard: 3,
  }
  return mapAttempts[level]
}

const askNextGuess = (maxAttempts, randomNumber, attempts = 0) => {
  rl.question("Enter your next guess: ", (nextGuess) => {
    attempts++
    if (nextGuess == randomNumber) {
      console.log(`Congratulations! You guessed the correct number in ${attempts} attempts.`)
      rl.close()
      return
    } else {
      if (attempts == maxAttempts) {
        console.log(`Game Over! You have reached the maximum number of attempts.`)
        rl.close()
        return
      }
      console.log(`Incorrect! The number is ${nextGuess > randomNumber ? "less" : "greater"} than ${nextGuess}.`)
      askNextGuess(maxAttempts, randomNumber, attempts)
    }
  })
}

const guessNumber = (level) => {
  const maxAttempts = findAttempts(level)
  const randomNumber = generateRandomNumber(maxAttempts)

  console.log(`Great! You have selected the ${level} level.\nLet's start the game!\n`)
  askNextGuess(maxAttempts, randomNumber)
}


const main = () => {
  console.log(`Welcome to the Number Guessing Game!\nI'm thinking of a number between 1 and 100.\nYou have 10 attempts to guess the number.\n`)
  console.log("Please select the difficulty level: \n1. Easy (10 attempts)\n2. Medium (5 attempts)\n3. Hard (3 attempts)\n")
  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        guessNumber("easy")
        break;
      case "2":
        guessNumber("medium")
        break;
      case "3":
        guessNumber("hard")
        break;

      default:
        console.log("Invalid choice. Please select a valid difficulty level.")
        break;
    }
  })
}

main()