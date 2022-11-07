const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;


app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello World')
});


app.post('/', (req, res) => {
    res.send('Hello world')
})
app.listen(port, () => console.log(`Example app listening on port ${port}\!`));

