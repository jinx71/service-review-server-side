const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
// const data = require('./fakedata.json')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ssqjlwr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const servicesCollection = client.db("TravelWithMe").collection("Services");
        app.get('/', async (req, res) => {
            const query = {}
            const sort = { length: -1 };
            const limit = 3;
            const cursor = servicesCollection.find(query).sort(sort).limit(limit);

            // const cursor = servicesCollection.find({});

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
            const query = {}
            const sort = { length: -1 };
            const limit = 3;
            const cursor = servicesCollection.find(query).sort(sort).limit(limit);
            const services = await cursor.toArray();
            // console.log(services.map(a => a._id))
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            console.log(req.params.id)
            const query = { _id: ObjectId(req.params.id) };
            console.log(query)
            const option = {};
            const service = await servicesCollection.findOne(query);
            // console.log(service)
            // console.log(service)
            res.send(service);
        })
        app.post('/add-service', async (req, res) => {
            const newService = req.body;
            console.log(newService)
            const result = await servicesCollection.insertOne(newService)
            console.log(result)
            res.send(result.acknowledged)
        })
        app.post('/add-review', async (req, res) => {
            const newReview = req.body;
            const modReview = {};
            modReview["profileImage"] = newReview.profileImage
            modReview["displayName"] = newReview.displayName
            modReview["email"] = newReview.email
            modReview["personalRating"] = newReview.personalRating
            modReview["reviewDetails"] = newReview.reviewDetails
            const query = { _id: ObjectId(newReview._id) };
            const service = await servicesCollection.findOne(query);
            const updatedReview = service.review.push(modReview)
            console.log(service.review)
            const updateServiceWithReview = await servicesCollection.updateOne(query, {
                $push: { "review": modReview }
            })

            const updatedservice = await servicesCollection.findOne(query);
            // console.log(updatedservice)
            res.send(updatedservice)
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

