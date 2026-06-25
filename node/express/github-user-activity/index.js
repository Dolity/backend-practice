import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getUserActivity = async (type = "") => {
  try {
    const userActivity = await fetch(`https://api.github.com/users/dolity/events${type}`)
    const data = await userActivity.json()
    console.log("data: ", data)
    main()
  } catch (error) {
    console.error("Error cannot fetch user activity: ", error);
  }
}

const main = () => {
  console.log("GitHub User Activity");
  console.log("1. Get user activity event");
  console.log("2. Get user activity event public");
  console.log("3. Exit");

  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        getUserActivity();
        break;
      case "2":
        getUserActivity("/public");
        break;
      case "3":
        rl.close();
        break;

      default:
        break;
    }
  });
};

main();
