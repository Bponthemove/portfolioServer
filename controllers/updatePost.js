const Post = require('../models/post')
const ApiError = require('../errors/ApiError')

module.exports = async (req, res, next) => {
    const { id } = req.params
    const { accessFor, accessToken } = req.auth

    try {
        const x = await Post.find({ _id: id, TokenArray: accessToken })
    
        if (accessFor === 'thumbs') {
            if (x.length === 0) {
                await Post.findByIdAndUpdate(id, { ...req.body })
                const updatedPost = await Post.findByIdAndUpdate(id, { $push: {TokenArray: accessToken}})
                res.send(updatedPost)
            } else {
                next(ApiError.thumbsError('only 1 like/dislike per post'))
            }
        }
        if (accessFor === 'comments') {
            const data = await Post.findByIdAndUpdate(id, { ...req.body })
            res.send(data)
        } 
    } catch (err) {
        next(ApiError.internal('no such id found'))
    }
}
