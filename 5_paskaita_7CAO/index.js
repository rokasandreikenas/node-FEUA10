const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb"); // mongo db client importas

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;
const URI =
  "mongodb+srv://admin:admin@cluster0.lz7ll8h.mongodb.net/?retryWrites=true&w=majority"; // connection stringas (nepamirstam pakeisti password)

const client = new MongoClient(URI); // mongo db client instance

app.get("/", async (req, res) => {
  try {
    const con = await client.connect(); // prijungia prie Duomenu bazes
    const data = await con.db("demo1").collection("cars").find().toArray(); // veiksmas - istraukiama is duomenu bazes
    await con.close(); // atsijungiam nuo duomenu bazes

    res.send(data); // issiunciam duomenis i route
  } catch (error) {
    res.status(400).send(error); // suhandlinam errora ir nustatom 400 http statusa, kad suprastu jog kazkas ne OK
  }
});

app.post("/", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("cars")
      .insertOne({ brand: "Porsche", model: "911" }); // veiksmas - pridedam i duomenu baze
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/cars", async (req, res) => {
  try {
    const car = req.body;
    const con = await client.connect();
    const data = await con.db("demo1").collection("cars").insertOne(car);
    await con.close();

    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
