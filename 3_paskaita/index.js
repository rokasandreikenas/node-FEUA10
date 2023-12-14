const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const students = ["Rokas", "Tomas", "Petras"];

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/students", (req, res) => {
  res.send(students);
});

app.post("/students", (req, res) => {
  const student = req.body; // {name: "Kazys"}
  students.push(student.name);
  res.send({ message: "Created" });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
