const ApiError = require('./ApiError')

module.exports = (err, req, res, next) => {
        //no console. in prod as it is not async
    console.error(err)

    if (err instanceof ApiError) {
        res.status(err.code).json(err.message)
        return
    }

    res.status(500).json('something went wrong')
}


//Calls to next() and next(err) indicate that the current handler is complete and in what state. 
//next(err) will skip all remaining handlers in the chain except for those that are set up to handle errors.