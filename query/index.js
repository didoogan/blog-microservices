const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    console.log('inside handleEvent');
    console.log(`type, data : ${type}, ${Object.keys(data)}, ${Object.values(data)}`);
    if (type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = {id, title, comments: []};
    }

    if (type === 'CommentUpdated') {
        const {id, content, postId, status} = data;
        const post = posts[postId];
        post.comments.push({id, content, status});
    }

    if (type === 'CommentUpdated') {
        const {id, content, postId, status} = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
    }
};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    let {type, data} = req.body;
    console.log(`type, data :${type}, ${data}`);
    handleEvent(type, data);
    res.send({});
});

const APP_PORT = 4002;

app.listen(APP_PORT, async () => {
    console.log(`Listening on ${APP_PORT}`);
    const res = await axios.get('http://event-bus-srv:4005/events');

    for (let event of res.data) {
        console.log('Processing event: ', event.type);
        handleEvent(event.type, event.data);
    }
});
