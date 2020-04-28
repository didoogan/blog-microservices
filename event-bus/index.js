const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event);
    try {
        axios.post('http://posts-clusterip-srv:4000/events', event);
        axios.post('http://comments-srv:4001/events', event);
        axios.post('http://query-srv:4002/events', event);
        axios.post('http://moderation-srv:4003/events', event);
    } catch (err) {
        console.log(`Error in event bus: ${err}`);
    }

    res.send({status: 'OK'});
});

app.get('/events', (req, res) => {
    res.send(events);
});

const APP_PORT = 4005;
app.listen(APP_PORT, () => {
    console.log(`Listening on ${APP_PORT}`);
});
