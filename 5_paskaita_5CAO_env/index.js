const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb"); // mongo db client importas
require("dotenv").config(); // paleidziam .env faila

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080; // istraukia is .env failo PORT kintamaji arba fallback i 8080
const URI = process.env.DB_CONNECTION_STRING; // connection stringas (nepamirstam pakeisti password)

const client = new MongoClient(URI); // mongo db client instance

app.get("/fruits", async (req, res) => {
  try {
    const con = await client.connect(); // prijungia prie Duomenu bazes
    const data = await con.db("manodb").collection("fruits").find().toArray(); // veiksmas - istraukiama is duomenu bazes
    await con.close(); // atsijungiam nuo duomenu bazes

    res.send(data); // issiunciam duomenis i route
  } catch (error) {
    res.status(400).send(error); // suhandlinam errora ir nustatom 400 http statusa, kad suprastu jog kazkas ne OK
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

app.listen(port, () => console.log(`Server is listening on port ${port}`));
