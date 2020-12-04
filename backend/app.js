const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

mongoose.connect("mongodb+srv://sdatrey:lZwYgd9qx45EQjzG@cluster0.njmh8.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
    console.log('Connected Successfully');
})
.catch(() => {
    console.log('Connection Failed');
})

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    )
    next();
});

app.post('/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    res.status(201).json({
        message : 'Post added successfully'
    })
})

app.use('/posts',(req, res, next) =>{
    const posts = [
        {
            id: 'dsgsg342',
            title: 'First Post',
            content: 'Content of first post'
        },
        {
            id: 'agbi434',
            title: 'Second Post',
            content: 'Content of Second post'
        }
    ];
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
});


module.exports = app;