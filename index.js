// Importing Moduels

const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3001;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())

// Jwt Token Middle Ware

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        console.log('tokenOk')
        next();
    })
}



// MongoDB Database Connection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ssqjlwr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const dateTime = () => {
    let dateTimeArray = [];
    let dateTimeString = new Date(Date.now());
    let time = dateTimeString.toLocaleTimeString('en-uk', { hour12: false });
    let date = dateTimeString.toLocaleDateString('en-uk', { year: "numeric", month: "short", day: "numeric" });
    dateTimeArray.push(time, date);

    return dateTimeArray;
}


// Database CRUD Operation

async function run() {
    try {
        const servicesCollection = client.db("TravelWithMe").collection("Services");
        app.get('/', async (req, res) => {
            const query = {}
            const sort = { length: -1 };
            const limit = 3;
            const cursor = servicesCollection.find(query).sort(sort).limit(limit);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        })
        app.get('/services', async (req, res) => {
            // console.log(req.body)
            // const decoded = req.decoded;

            // if (decoded.email !== req.query.email) {
            //     res.status(403).send({ message: 'unauthorized access' })
            // }

            // let query = {};
            // if (req.query.email) {
            //     query = {
            //         email: req.query.email
            //     }
            // }

            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/my-review', verifyJWT, async (req, res) => {
            console.log(req.query)
            const decoded = req.decoded;

            if (decoded.email !== req.query.email) {
                res.send("403")
                res.status(403).send({ message: 'unauthorized access', email: req.query.email })
            }

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/home', async (req, res) => {
            const query = {}
            const sort = { length: -1 };
            const limit = 3;
            const cursor = servicesCollection.find(query).sort(sort).limit(limit);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            console.log(req.params.id)
            const query = { _id: ObjectId(req.params.id) };
            console.log(query)
            const option = {};
            const service = await servicesCollection.findOne(query);
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
            modReview["serviceName"] = newReview.serviceName
            modReview["date"] = dateTime()[1]
            const query = { _id: ObjectId(newReview._id) };
            const service = await servicesCollection.findOne(query);
            const updatedReview = service.review.push(modReview)
            console.log(service.review)
            const updateServiceWithReview = await servicesCollection.updateOne(query, {
                $push: { "review": modReview }
            })

            const updatedservice = await servicesCollection.findOne(query);
            res.send(updatedservice)
        })
        app.post('/delete-review', async (req, res) => {
            const newReview = req.body;
            console.log(newReview)
            const services = await servicesCollection.update(
                { serviceName: newReview.serviceName },
                {
                    $pull: {
                        review: newReview
                    }
                }
            );
            console.log(services)
            res.send(services.acknowledged)
        })
        app.post('/edit-review', async (req, res) => {
            const newReview = req.body;
            console.log(newReview)
            const services = await servicesCollection.update(
                { serviceName: newReview.serviceName },
                {
                    $set: {
                        review: newReview
                    }
                }
            );
            console.log(services)
            res.send(services.acknowledged)
        })
    }
    finally {
        console.log('hello')
    }

}
run().catch(err => console.log(err))
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

