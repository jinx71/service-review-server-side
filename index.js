const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const data = require('./fakedata.json')

app.use(cors())


app.get('/', (req, res) => {
    res.send(data)
});
app.get('/home', (req, res) => {
    res.send(data)
});
app.get('/services', (req, res) => {
    res.send(data)
});
app.get('/services/:id', (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)
    const service = data.find(a => a.id === id)
    console.log(service)
    res.send(service)
});

app.post('/', (req, res) => {
    res.send('Hello world')
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

