const Post = require('../models/post')
const ApiError = require('../errors/ApiError')

module.exports = async (req, res) => {   
    try {
        if (req.auth.access) {
            const newPost = await req.body
            const data = await Post.create(newPost)
            console.log(data)
            res.send(data)
        }
    } catch (err) {
        next(ApiError.internal('no such id found'))
    } 
}