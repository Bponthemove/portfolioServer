const jwt = require("jsonwebtoken")
const ApiError = require('./errors/ApiError')
require('dotenv').config()

module.exports = (req, res, next) => {
        // Read the JWT access token from the request header
    const { accesstype: accessType, authorization, accessfor } = req.headers;
    const token = authorization && authorization.split(" ")[1]
        // Verify the token using the Userfront public key 
        //  use .replace(/\\n/gm, '\n') and \n before and after the string in the env file
    try {
        jwt.verify(token, process.env.USERFRONT_PUBLIC_KEY.replace(/\\n/gm, '\n'), (err, auth) => {
            if (err) {
                // Return 403 if there is an error verifying
                next(ApiError.tokenError('token verification error'))
                return
            }     
            
            const accessRole = auth.authorization[process.env.USERFRONT_TENANT_ID] || {}
        
            if ((accessType === 'admin' & accessRole.roles.includes('admin')) || (accessType === 'member' & accessRole.roles.includes('member'))) {
                req.auth = {data: auth, access: true, token: token, accessFor: accessfor}
                next()
            } else {
                next(ApiError.tokenError('You are not authorized for this action'))
                return
            }
        })
    } catch (err) {
        //return 401 authorization error
        next(ApiError.authError('no token'))
        return
    }
}
