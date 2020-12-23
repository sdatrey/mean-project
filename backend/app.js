const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

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
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    )
    next();
});

app.use('/posts', postRoutes);
app.use('', userRoutes);

module.exports = app;