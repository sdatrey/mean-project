const express = require('express');
const router = express.Router();


const PostController = require('../controllers/posts');
const checkAuth = require("../middleware/check-auth");
const fileAuth = require("../middleware/file");


router.get('', PostController.getPosts);


router.post('', checkAuth, fileAuth, PostController.createPost);

router.get('/:id', PostController.getPost);

router.put('/:id', checkAuth, fileAuth, PostController.updatePost);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;