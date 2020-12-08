const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');


const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

mongoose.connect("mongodb+srv://sdatrey:lZwYgd9qx45EQjzG@cluster0.njmh8.mongodb.net/node-angular", {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => {
    console.log('Connected Successfully');
})
.catch((e) => {
    console.log('Connection Failed', e);
})

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    )
    next();
});



app.get('/posts',(req, res, next) =>{
    Post.find().then(documents => {
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

});

app.get('/posts/:id', (req, res, next) =>{
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }
        else{
            res.status(404).json({message: 'Post not found'})
        }
    })
})

app.put('/posts/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then(result =>{
        res.status(200).json({
            message: 'Post updated successfully'
        });
    });
});

app.delete('/posts/:id', (req, res , next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: 'Post deleted successfully'
        });
    });
   
});


module.exports = app;