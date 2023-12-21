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

// Sujungimas dvieju kolekciju - agregacija
app.get("/pets", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("manodb")
      .collection("pets")
      .aggregate([
        {
          $lookup: {
            from: "people", // The collection to join with
            localField: "ownerId", // The field from the pets collection
            foreignField: "_id", // The field from the people collection
            as: "owner", // The output array where the joined data will be
          },
        },
        {
          // unwind is masyvo istraukia viena objekta
          $unwind: {
            path: "$owner",
            preserveNullAndEmptyArrays: true, // Preserve pets without an owner
          },
        },
      ])
      .toArray();
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

// pridejimas
app.post("/pets", async (req, res) => {
  try {
    const pet = req.body;
    const petWithOwnerId = { ...pet, ownerId: new ObjectId(pet.ownerId) }; // turbo object - change type manually

    const con = await client.connect();
    const data = await con
      .db("manodb")
      .collection("pets")
      .insertOne(petWithOwnerId);
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Sujungimas dvieju kolekciju - agregacija
app.get("/people", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("manodb")
      .collection("people")
      .aggregate([
        {
          $lookup: {
            from: "pets", // The collection to join with
            localField: "_id", // The field from the people collection
            foreignField: "ownerId", // The field from the pets collection
            as: "pets", // The output array where the joined data will be
          },
        },
      ])
      .toArray();
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/people", async (req, res) => {
  try {
    const people = req.body;
    const con = await client.connect();
    const data = await con.db("manodb").collection("people").insertOne(people);
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

// triname pagal Id
app.delete("/pets/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const con = await client.connect();
    const data = await con
      .db("manodb")
      .collection("pets")
      .deleteOne({ _id: new ObjectId(id) });
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
