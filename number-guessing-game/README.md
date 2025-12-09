
## Number Guessing Game

This is a simple command-line **Number Guessing Game** built with Node.js.

The program picks a random number between **1 and 100**, and you need to guess the correct number within a limited number of attempts based on the difficulty level you choose.

---

### Features

- **Random number** between 1 and 100 on every game.
- **Three difficulty levels**:
  - Easy – 10 attempts
  - Medium – 5 attempts
  - Hard – 3 attempts
- Feedback after each guess telling you if the secret number is **greater than** or **less than** your guess.
- Game ends when you either **guess correctly** or **run out of attempts**.

---

### Requirements

- Node.js or Bun installed on your machine.

You can check your versions with:

```bash
node -v
bun -v
```

---

### How to Run

1. Open a terminal in this folder:

```bash
cd number-guessing-game
```

2. Run the game using **Node.js**:

```bash
node index.js
```

   Or using **Bun**:

```bash
bun index.js
```

3. Follow the instructions in the terminal:
   - Read the welcome message.
   - Choose a difficulty level.
   - Start entering your guesses.

---

### Game Rules

1. The game selects a random integer between **1 and 100**.
2. You choose a **difficulty level**:
   - Easy: 10 attempts
   - Medium: 5 attempts
   - Hard: 3 attempts
3. On each turn you enter a number guess.
4. After each guess, the program will tell you whether the secret number is:
   - **less than** your guess, or
   - **greater than** your guess.
5. The game ends when:
   - You guess the correct number (you win), or
   - You use all of your attempts (Game Over).

---

### Notes

- You can restart the game at any time by running the command again:

```bash
node index.js
```

- This project is a small practice exercise for working with:
  - Node.js (or Bun) runtime
  - `readline` for reading user input from the terminal
  - Basic control flow and recursion in JavaScript

