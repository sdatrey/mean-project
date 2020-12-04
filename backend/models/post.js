const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title : {
        type: String,
        requirde: true
    },
    content: {
        type: String,
        requirde: true
    }
});

module.exports = mongoose.model('Post', postSchema);