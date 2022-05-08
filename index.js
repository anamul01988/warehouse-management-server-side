const express = require("express");
// const jwt = require('jsonwebtoken');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
//MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ur7rw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productsCollection = client
      .db("electronicHouse")
      .collection("product");

    //    //auth jwt token
    //    app.post('/login',async(req, res)=>{
    //     const user = req.body;
    //     const getAccessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
    //         expiresIn: '1d'
    //     });
    //     res.send({getAccessToken});
    // })

    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventories = await productsCollection.findOne(query);
      res.send(inventories);
    });

    //post data to backend
    app.post("/inventory", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const item = await productsCollection.insertOne(newItem);
      res.send(item)
    });

    //get data for my items

    app.get("/myitem", async (req, res) => {
      console.log(req);
      const email = req.query;
      console.log(email);
      const query = { email: email };
      console.log(query);
      const cursor = productsCollection.find(query);
      const item = await cursor.toArray();
      res.send(item);
    });

    //delete items from manage Items
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await productsCollection.deleteOne(query);
      res.send(item);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Electronic House server is running!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
