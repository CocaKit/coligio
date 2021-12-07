const jwt = require('jsonwebtoken')
require('dotenv').config()
const TokenModel = require('../models/token-model')

class TokenService {
	generateToken(payload){
		const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS_KEY, {expiresIn: '30m'})
		const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH_KEY, {expiresIn: '30d'})
		return {
			accessToken,
			refreshToken
		}
	}

	async saveToken(userId, refreshToken){
		const foundToken = await TokenModel.findOne({userId})
		if (foundToken){
			foundToken.refreshToken = refreshToken
			return foundToken.save()
		}

		const token = await TokenModel.create({userId, refreshToken})
		return token 
	}

	async removeToken(refreshToken){
		const token  = await TokenModel.deleteOne({refreshToken})
		return token
	}

	async validateRefreshToken(token){
		try {
			const user = jwt.verify(token, process.env.JWT_SECRET_REFRESH_KEY)
			return user
		}
		catch(e) {
			return Promise.resolve(null)
		}
	}

	async findToken(refreshToken){
		const token  = await TokenModel.findOne({refreshToken})
		return token
	}
}

module.exports = new TokenService
