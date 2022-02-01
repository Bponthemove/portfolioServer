const jwt = require("jsonwebtoken")
const ApiError = require('./errors/ApiError')
require('dotenv').config()

module.exports = (req, res, next) => {
        // Read the JWT access token from the request header
    const accessToken = req.headers.authorization.replace("Bearer ", "")
    const { accesstype: accessType, accessfor: accessFor } = req.headers
    
        // Verify the token using the Userfront public key 
        //  use .replace(/\\n/gm, '\n') and \n before and after the string in the env file
    try {
        jwt.verify(accessToken, process.env.USERFRONT_PUBLIC_KEY.replace(/\\n/gm, '\n'), (err, auth) => {
            if (err) {
        //403 token verification error
                return next(ApiError.tokenError('token verification error'))
            } else {
        //check whether access is authorized for certain action (eg member auth for member access and admin auth for admin access)
                const accessRole = auth.authorization[process.env.USERFRONT_TENANT_ID] || {}
                if ((accessType === 'admin' & accessRole.roles.includes('admin')) || (accessType === 'member' & accessRole.roles.includes('member'))) {
                    req.auth = { auth, accessFor, accessToken }
                    return next()
                } else {
                    return next(ApiError.tokenError('You are not authorized for this action'))
                }
            }
        })
    } catch (err) {
        //return 401 authorization error
        next(ApiError.authError('Authorization error'))
    }
}
