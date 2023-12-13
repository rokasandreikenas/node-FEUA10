const express = require("express"); // importuojam
const cors = require("cors");

// 1. create index.js and package.json
// 2. install dependencies
// 3. create instance
// 4. use cors for instace
// 5. create routes "/", "/cars"
// 6. make application listen

const app = express(); // sukuriam instance
app.use(cors()); // panaudojam cors

// www.rokoapi.com/
app.get("/", (req, res) => {
  // req - request (kvietimas)
  // res - response (atsakymas)
  res.send("OK");
});

// www.rokoapi.com/fruits
app.get("/fruits", (req, res) => {
  const fruits = ["Carrot", "Banana", "Apple"];
  res.send(fruits);
});

app.get("/todos", (req, res) => {
  const todos = [
    {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    },
    {
      userId: 1,
      id: 2,
      title: "quis ut nam facilis et officia qui",
      completed: false,
    },
    {
      userId: 1,
      id: 3,
      title: "fugiat veniam minus",
      completed: false,
    },
  ];

  res.send(todos);
});

// localhost:3000/ => OK
// localhost:3000/fruits => [...]
// localhost:3000/todos => [{...}, {...}]

app.listen(3000, () => console.log("The server is running on port 3000")); // klausomes ant nurodyto port
