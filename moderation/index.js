const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const {type, data} = req.body;
    console.log(`type, data: ${type}, ${data}`);
    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });

        res.send({});
    }
});

const APP_PORT = 4003;

app.listen(APP_PORT, () => {
    console.log(`Listening on ${APP_PORT}`);
});
