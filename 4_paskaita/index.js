const express = require("express");
const cors = require("cors");
const data = require("./data");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send({ message: "OK" });
});

app.get("/bmw", (req, res) => {
  res.send(["i3", "i8", "1 series", "3 series", "5 series"]);
});

app.get("/audi", (req, res) => {
  res.send(["a1", "a2"]);
});

app.get("/cars/:model", (req, res) => {
  console.log(req.params.model);
  res.send({ model: req.params.model });
});

const phones = {
  iphone: ["X", "XR", "XS", "11 Pro max", "14 Pro"],
  samsung: ["S10", "S12", "S16", "S20"],
  huawei: ["P20", "P30"],
};

app.get("/phones/:model", (req, res) => {
  const model = req.params.model;

  res.send(phones[model]);
});

// /books => [{...}]
app.get("/books", (req, res) => {
  res.send(data);
});

// /books/genre/Fiction
app.get("/books/genre/:genre", (req, res) => {
  const genre = req.params.genre;
  const filteredBooks = data.filter((book) => book.genre === genre);
  res.send(filteredBooks);
});

// /books/years
app.get("/books/years", (req, res) => {
  const publicationYears = data.map((book) => book.publication_year);
  res.send(publicationYears);
});

// /books/new
app.get("/books/new", (req, res) => {
  const newBooks = data.filter((book) => book.publication_year >= 2000);
  const books = newBooks.map(
    (book) => `${book.title} (${book.publication_year})`
  );
  res.send(books);
});

// /books/old
app.get("/books/old", (req, res) => {
  const oldBooks = data.filter((book) => book.publication_year <= 2000);
  const books = oldBooks.map(
    (book) => `${book.title} (${book.publication_year})`
  );
  res.send(books);
});

// /books/3
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const foundBook = data.find((book) => book.id === id); // {...} ar undefined

  if (foundBook) {
    res.send(foundBook);
  } else {
    res.send({ message: "Book not found" });
  }
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
