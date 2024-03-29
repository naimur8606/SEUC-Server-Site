const express = require('express');
const cors = require("cors");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kc6dmnx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const allUsers = client.db("SEU-Communication").collection("Users");


        app.get("/Users", async (req, res) => {
            const result = await allUsers.find().toArray();
            res.send(result);
        })

        app.post("/Users", async (req, res) => {
            const user = req?.body;
            const query = { email: req?.body?.email };
            const present = await allUsers.findOne(query)
            if (!present) {
                const result = await allUsers.insertOne(user);
                res.send(result);
            }
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('SEU Communication Server  is open...')
})

app.listen(port, () => {
    console.log(`SEU Communication Server is open on port ${port}`)
})