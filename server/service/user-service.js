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

	async login(email, password) {
		const user = await UserModel.findOne({email})
		if (!user){
			throw ApiError.badRequestError(`User with email ${email} dont exists.`)
		}

		const correctPassword = await bcrypt.compare(password, user.password)
		if (!correctPassword){
			throw ApiError.badRequestError(`Wrong password`)
		}

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
	async logout(refreshToken){
		const token = await TokenService.removeToken(refreshToken)
		return token
	}
	async refresh(refreshToken){
		if (!refreshToken){
			throw ApiError.unauthorisedError()
		}
		const user = await TokenService.validateRefreshToken(refreshToken)
		const tokenDb = await TokenService.findToken(refreshToken)
		if (!user || !tokenDb){
			throw ApiError.unauthorisedError()
		}

		const user = UserModel.findById(user.id)
		const userDto = new UserDto(user)
		const tokens = TokenService.generateToken({...userDto})
		await TokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async getUsers() {
		const users = await UserModel.find()
		return users
	}

}

module.exports = new UserService
