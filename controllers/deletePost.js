const ApiError = require('../errors/ApiError')
const Post = require('../models/post')

module.exports = async (req, res, next) => {
    try {
        if (req.auth.access) {
            const { id } = req.params
            const data = await Post.findByIdAndDelete(id)
            res.send(data)
        }
    } catch (err) {
        next(ApiError.internal('no such id found'))
    }
}
