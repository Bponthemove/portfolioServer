const ApiError = require('./ApiError')

module.exports = (err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.code).json(err.message)
        return
    }

    res.status(500).json('something went wrong')
}


//Calls to next() and next(err) indicate that the current handler is complete and in what state. 
//next(err) will skip all remaining handlers in the chain except for those that are set up to handle errors.