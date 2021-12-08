const ApiError = require('../exceptions/api-error')
const TokenService = require('../service/token-service')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next) {
	try {
		const authHeader = req.headers.auth
		if (!authHeader){
			return next(ApiError.unauthorisedError())
		}

		const accessToken = authHeader.split(' ')[1]
		if (!accessToken){
			return next(ApiError.unauthorisedError())
		}

		const user = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS_KEY)

		req.user = user
		next()
	}
	catch(e) {
		return next(ApiError.unauthorisedError())
	}
}
