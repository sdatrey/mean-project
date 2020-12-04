const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');
const post = require('./models/post');


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



app.get('/posts',(req, res, next) =>{
    post.find().then(documents => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: documents
        });
    })
});

app.post('/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(result =>{
        res.status(201).json({
        message : 'Post added successfully',
        postId: result._id
    })
    });

})

app.delete('/posts/:id', (req, res , next) => {
    post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post deleted successfully'
        });
    });
   
});


module.exports = app;