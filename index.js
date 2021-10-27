const express = require('express')
//cors
const cors = require('cors')
//mongodb
const { MongoClient } = require('mongodb');
//Object id
const ObjectId = require('mongodb').ObjectId;
//from dotenv
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors())
app.use(express.json())



// user: carshopuser
//pass : xmjOH7ldCdTFwJr8

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i3fcr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//for checking after dynamically setting
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//function start
async function run() {
    try {
        await client.connect()
        const database = client.db("carMechanic")
        const servicesCollection = database.collection("services");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //Get Single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting specific service');
            const query = { _id: ObjectId(id) }

            const service = await servicesCollection.findOne(query);

            res.json(service);
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = await req.body;

            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

//==========================
app.get('/', (req, res) => {
    res.send('Running Genius Car server')
})

app.listen(port, () => {
    console.log('Genius car server running on port', port);
})