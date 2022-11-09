const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const data = require('./fakedata.json')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ssqjlwr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const servicesCollection = client.db("TravelWithMe").collection("Services");
        app.get('/', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            // console.log(services)
            res.send(services);
        })
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            // console.log(services)
            res.send(services);
        })
        app.get('/home', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            // console.log(services)
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            console.log(req.params.id)
            const query = { _id: ObjectId(req.params.id) };
            console.log(query)
            const option = {};
            const service = await servicesCollection.findOne(query);
            console.log(service)
            // console.log(service)
            res.send(service);
        })
    }
    finally {
        console.log('hello')
    }

}
run().catch(err => console.log(err))



// app.get('/', (req, res) => {
//     res.send(data)
// });
// app.get('/home', (req, res) => {
//     res.send(data)
// });
// app.get('/services', (req, res) => {
//     res.send(data)
// });
// app.get('/services/:id', (req, res) => {
//     const id = parseInt(req.params.id)
//     console.log(id)
//     const service = data.find(a => a.id === id)
//     console.log(service)
//     res.send(service)
// });

app.post('/', (req, res) => {
    res.send('Hello world')
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

