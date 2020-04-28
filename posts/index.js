const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios  = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id,
        title
    };
    try {
        console.log(`id, title: ${id}, ${title}`);
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'PostCreated',
            data: {id,title}
        });
    } catch (err) {
        console.log(err);
    }
    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received Event: ', req.body.type);

    res.send({});
});

const APP_PORT = 4000;

app.listen(APP_PORT, () => {
    console.log('Mega change');
    console.log(`Listening on ${APP_PORT}`);
});
