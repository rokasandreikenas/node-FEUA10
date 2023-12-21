const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb"); // import ObjectId
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;
const URI = process.env.DB_CONNECTION_STRING;

const client = new MongoClient(URI);

app.get("/fruits", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db("manodb").collection("fruits").find().toArray();
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Filtravimas pagal tipą (ar betkokį kitą parametrą)
app.get("/fruits/type/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const con = await client.connect();
    const data = await con
      .db("manodb")
      .collection("fruits")
      .find({ type })
      .toArray();
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

// istraukimas vieno itemo pagal ID
app.get("/fruits/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const con = await client.connect();
    const data = await con
      .db("manodb")
      .collection("fruits")
      .findOne({ _id: new ObjectId(id) });
    // .findOne(new ObjectId(id)); same as ^
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/fruits", async (req, res) => {
  try {
    const fruit = req.body;
    const con = await client.connect();
    const data = await con.db("manodb").collection("fruits").insertOne(fruit);
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/movies", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db("manodb").collection("movies").find().toArray();
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/movies/:sort", async (req, res) => {
  try {
    const sort = req.params.sort;
    // 1 didejimo - ascending
    // -1 mazejimo - descending
    const con = await client.connect();
    const data = await con
      .db("manodb")
      .collection("movies")
      .find()
      .sort({ years: sort === "asc" ? 1 : -1 })
      // .sort({ title: -1 })
      .toArray();
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
