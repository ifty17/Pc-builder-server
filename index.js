const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
        const advertiseCollection = client.db('pcbuilder').collection('advertise');

        // post product for advertise
        app.post('/advertise', async(req, res) =>{
            const advertise = req.body;
            const result = await advertiseCollection.insertOne(advertise);
            res.send(result);
        })

        // get advertised product
        app.get('/advproduct', async(req, res) =>{
            const query = {};
            const result = await advertiseCollection.find(query).toArray();
            res.send(result);
        })

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

        //add product
        app.post('/products/add', async(req, res) =>{
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })

        //get products by category
        app.get('/products/:category_id', async(req, res)=>{
            const category = req.params.category_id;
            const query = { category_id: category};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        //get my products
        app.get('/productsbyemail', async(req, res) =>{
            const email = req.query.email;
            const query = {
              email: email,
            };
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        })

        // check available user
        app.get('/users', async(req, res) =>{
            const checkEmail = req.query.email;
            // console.log(email);
            const query = {email: checkEmail};
            const result = await usersCollection.find(query).toArray();
            res.send(result);        
        })

        // Save users to database
        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/allsellers', async(req, res) =>{
            const query = {role: 'seller'}
            const user = await usersCollection.find(query).toArray();
            res.send(user); 
        })

        app.get('/allbuyers', async(req, res) =>{
            const query = {role: 'buyer'}
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        })

        // check available user is database
        app.get('/checkUsers', async(req, res) =>{
            const email = req.query.email;
            const query = {
                email: email
            }
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })

        //check admin
         app.get("/users/admin/:email", async (req, res) => {
           const email = req.params.email;
           const query = { email };
           const user = await usersCollection.findOne(query);
           res.send({ isAdmin: user?.role === "admin" });
         });

         //check buyer
         app.get("/users/buyer/:email", async (req, res) => {
           const email = req.params.email;
           const query = { email };
           const user = await usersCollection.findOne(query);
           res.send({ isBuyer: user?.role === "buyer" });
         });

         //check Seller
         app.get('/seller/:email', async(req, res) =>{
            const email = req.params.email;
            const query = {email};
            const user = await usersCollection.findOne(query);
            res.send({isSeller: user?.role === 'seller'})
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
        });

        // delete buyer
        app.delete("/buyer/:id", async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const result = await usersCollection.deleteOne(filter);
          res.send(result);
        });


    }
    finally{

    }
}run().catch(console.log);


app.get('/', (req, res) =>{
    res.send('PC builder running')
});

app.listen(port, () => console.log(`pc builder running on port ${port}`));