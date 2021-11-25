const ApiError = require('../exceptions/api-error')
const TokenService = require('../service/token-service')

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

		const user = TokenService.validateAccessToken(accessToken)
		if (!user){
			return next(ApiError.unauthorisedError())
		}

		req.user = user
		next()
	}
	catch(e) {
		return next(ApiError.unauthorisedError())
	}
}
