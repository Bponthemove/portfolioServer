const Post = require('../models/post')
const ApiError = require('../errors/ApiError')

module.exports = async (req, res) => {
    const { id } = req.params
    const { accessFor, token } = req.auth
    try {
        const x = await Post.find({ _id: id, TokenArray: token })
        if (req.auth.access && accessFor === 'thumbs') {
            if (x.length === 0) {
                await Post.findByIdAndUpdate(id, { ...req.body })
                const data = await Post.findByIdAndUpdate(id, { $push: {TokenArray: token}})
                res.send(data)
            }
        }
        if (req.auth.access && accessFor === 'comments') {
            const data = await Post.findByIdAndUpdate(id, { ...req.body })
            res.send(data)
        } 
    } catch (err) {
        next(ApiError.internal('no such id found'))
    }
}
