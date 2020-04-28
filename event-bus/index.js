const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [];

app.post('/events', (req, res) => {
    console.log('req.body: ', req);
    const event = req.body;

    events.push(event);

    console.log(event);
    axios.post('http://posts-clusterip-srv:4000/events', event);
    axios.post('http://localhost:4001/events', event);
    axios.post('http://localhost:4002/events', event);
    axios.post('http://localhost:4003/events', event);


    res.send({status: 'OK'});
});

app.get('/events', (req, res) => {
    res.send(events);
});

const APP_PORT = 4005;
app.listen(APP_PORT, () => {
    console.log(`Listening on ${APP_PORT}`);
});
