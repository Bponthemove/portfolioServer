const mongoose = require('mongoose')

const subCommentsSchema = new mongoose.Schema({
    Comment: {
        type: String
    },
    TimeComment: {
        type: String
    }
})

const postSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Text: {
        type: String,
        required: true
    },
    Time: {
        type: String
    },
    Likes: {
        type: Number,
        default: 0,
        required: true,
    },
    TokenArrayLikes: [],
    Dislikes: {
        type: Number,
        default: 0,
        required: true
    },
    TokenArrayDislikes: [],
    Comments: [subCommentsSchema]
})

module.exports = mongoose.model('Post', postSchema)