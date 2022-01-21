class ApiError {
    constructor(code, message) {
        this.code = code
        this.message = message
    }
    static badRequest(msg) {
        return new ApiError(400, msg)
    }
    static authError(msg) {
        return new ApiError(401, msg)
    }
    static tokenError(msg) {
        return new ApiError(403, msg)
    }
    static internal(msg) {
        return new ApiError(500, msg)
    }
}

module.exports = ApiError