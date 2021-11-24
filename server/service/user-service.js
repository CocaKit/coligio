const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const EmailService = require('./email-service')
const TokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

require('dotenv').config()

class UserService {
	async registration(nickname, email, password){
		const candidateEmail = await UserModel.findOne({email})
		const candidateNickname = await UserModel.findOne({nickname})
		if (candidateNickname || candidateEmail){
			throw ApiError.badRequestError(`User with nickname ${nickname} or email ${email} exists.`)
		}

		const passwordHash = await bcrypt.hash(password, 3)
		const activationLink = uuid.v4()
		const user = await UserModel.create({nickname, email, password: passwordHash, activationLink})

		await EmailService.sendActivationLink(email, `${process.env.API_URL}/api/activate/${activationLink}`)

		const userDto = new UserDto(user)
		const tokens = TokenService.generateToken({...userDto})
		await TokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}
	async activate(link){
		const user = await UserModel.findOne({activationLink: link})
		if (!user) {
			throw ApiError.badRequestError("Uncorrect activation link")
		}
		user.isActivated = true
		await user.save()
	}
}

module.exports = new UserService
