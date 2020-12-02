const express = require('express');

const app = express();

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
        message: 'Posts fetched succesfully',
        posts: posts
    });
});


module.exports = app;