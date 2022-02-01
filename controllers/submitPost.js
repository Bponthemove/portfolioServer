const Post = require('../models/post')
const ApiError = require('../errors/ApiError')

module.exports = async (req, res) => {   
    try {
        const newPost = await req.body
        const data = await Post.create(newPost)
        res.send(data)
    } catch (err) {
        next(ApiError.internal('no such id found'))
    } 
}