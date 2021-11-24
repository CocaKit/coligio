class ApiError extends Error {
	constructor(status, message, errors = []) {
		super(message)
		this.status = status
		this.errors = errors
	}

	static unauthorisedError(){
		return new ApiError(401, "User is unauthorised")
	}

	static badRequestError(message, errors = []) {
		return new ApiError(400, message, errors)
	}
}

module.exports  = ApiError
