const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3e0xlo7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    try{
        const categoriesCollection = client.db('pcbuilder').collection('categories');
        const productsCollection = client.db('pcbuilder').collection('products');
        const usersCollection = client.db('pcbuilder').collection('users');
        const ordersCollection = client.db('pcbuilder').collection('orders');

        // get categories
        app.get('/categories', async(req, res) =>{
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });

        //get all products
        app.get('/products', async(req, res) =>{
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        //get products by category
        app.get('/products/:category_id', async(req, res)=>{
            const category = req.params.category_id;
            console.log(category);
            const query = { category_id: category};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        // Save users to database
        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // check available user is database
        app.get('/checkUsers', async(req, res) =>{
            const email = req.query.email;
            const query = {
                email: email
            }
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })

        //save orders
        app.post("/orders", async(req, res) =>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        // My orders
        app.get('/orders', async(req, res) =>{
            const email = req.query.email;
            const query = {
                email: email
            }
            const result = await ordersCollection.find(query).toArray();
            res.send(result);
        })


    }
    finally{

    }
}run().catch(console.log);


app.get('/', (req, res) =>{
    res.send('PC builder running')
});

app.listen(port, () => console.log(`pc builder running on port ${port}`));