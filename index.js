const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;
//MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ur7rw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const productsCollection = client.db('electronicHouse').collection('product');
    
    app.get('/inventory', async(req, res)=>{
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products)
    })
    
  app.get('/inventory/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const inventories = await productsCollection.findOne(query);
    res.send(inventories);
});

//post data to backend
app.post('/inventory', async(req, res)=>{
  const newItem = req.body;
  const item = await productsCollection.insertOne(newItem);
  res.send(item)
})
   
  } finally {
    
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Electronic House server is running!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})