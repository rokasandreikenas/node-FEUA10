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
