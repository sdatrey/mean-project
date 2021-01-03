const bcrypt  = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(result => {
            const token = jwt.sign(
                { email: result.email, userId: result._id },
                "secret_this_should_be_longer",
                { expiresIn: '1h' }
            );
            res.status(201).json({
                token: token,
                expiresIn: 3600,
                userId: result._id
            });
        }).catch(err => {
            res.status(500).json({
               message: "Invalid authentication credentials"
            });
        });
    })
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email}).then(user => {
        if(!user){
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        fetchedUser = user;
    return bcrypt.compare(req.body.password, fetchedUser.password)
    }).then(result =>{
        if(!result){
            return res.status(401).json({
                message: 'Auth failed',
            })
        }
        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            "secret_this_should_be_longer",
            { expiresIn: '1h' }
        );
        res.json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Invalid authentication credentials'
        })
    })
});


module.exports = router;