const UserModel = require('../models/user-model')
const DictionaryModel = require('../models/dictionary-model')
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
		var user = await TokenService.validateRefreshToken(refreshToken)
		const tokenDb = await TokenService.findToken(refreshToken)
		if (!user || !tokenDb){
			throw ApiError.unauthorisedError()
		}

		user = await UserModel.findById(user.id)
		const userDto = new UserDto(user)
		const tokens = TokenService.generateToken({...userDto})
		await TokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async getUsers() {
		const users = await UserModel.find()
		return users
	}

	async editUser(id, nickname, level) {
		const user = await UserModel.findById(id)
		if (!user){
			throw ApiError.badRequestError(`User with id ${id} dont exists`)
		}

		user.nickname = nickname
		user.level = level
		await user.save()

		const userDto = new UserDto(user)
		return userDto
	}

	async editPassword(id, oldPassword, newPassword){
		const user = await UserModel.findById(id)
		if (!user){
			throw ApiError.badRequestError(`User with id ${id} dont exists`)
		}

		const correctPassword = await bcrypt.compare(oldPassword, user.password)
		if (!correctPassword){
			throw ApiError.badRequestError(`Wrong password`)
		}

		const passwordHash = await bcrypt.hash(newPassword, 3)
		user.password = passwordHash
		await user.save()

		const userDto = new UserDto(user)
		return userDto
	}

	async addWordToPersonal(userId, wordId, nextDays){
		const user = await UserModel.findById(userId)
		if (!user) {
			throw ApiError.badRequestError(`User with id ${userId} dont exists`)
		}

		const word = await DictionaryModel.findById(wordId)
		if (!word) {
			throw ApiError.badRequestError(`Word with id ${wordId} dont exists`)
		}

		console.log(user)
		const wordsArray = user.words
		const similarIndex = wordsArray.findIndex(item => item.idWord == wordId)
		console.log(wordsArray)
		console.log(similarIndex)
		if (similarIndex != -1) { 
			wordsArray.splice(similarIndex, 1)
		}

		console.log(wordsArray)
		var now = new Date()
		var nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + nextDays)
		const accessDays = parseInt(nextDays / 2) + nextDays + 1
		const failDays = nextDays - parseInt(nextDays / 2)
		wordsArray.push({'idWord' : wordId, 'nextDate' : nextDate, 'daysPassed' : nextDays, 'accessDays' : accessDays, 'failDays' : failDays})

		user.words = wordsArray
		user.save()

		const userDto = new UserDto(user)
		return userDto
	}

	async deleteWordFromPersonal(userId, wordId){
		const user = await UserModel.findById(userId)
		if (!user) {
			throw ApiError.badRequestError(`User with id ${userId} dont exists`)
		}

		const word = await DictionaryModel.findById(wordId)
		if (!word) {
			throw ApiError.badRequestError(`Word with id ${wordId} dont exists`)
		}

		var wordsArray = user.words
		const similarIndex = wordsArray.findIndex(item => item.idWord == wordId)
		if (similarIndex == -1) { 
			throw ApiError.badRequestError(`User has no word with id ${wordId} dont exists`)
		}
		wordsArray.splice(similarIndex, 1)

		user.words = wordsArray
		user.save()
		const userDto = new UserDto(user)
		return userDto
	}

	async getTodayWords(userId) {
		const user = await UserModel.findById(userId)
		if (!user) {
			throw ApiError.badRequestError(`User with id ${userId} dont exists`)
		}

		const now = new Date()
		const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const wordsArray = user.words
		const todayWordsArray = wordsArray.filter(item => item.nextDate.valueOf() <= todayDate.valueOf())

		return todayWordsArray
	}

	async getPossibleWords(userId) {
		const user = await UserModel.findById(userId)
		if (!user) {
			throw ApiError.badRequestError(`User with id ${userId} dont exists`)
		}

		const personalWordsArray = user.words.map(item => item.idWord.toString())
		const mainWordsArray = await DictionaryModel.find()

		const possibleWordsArray = mainWordsArray.filter(item => !personalWordsArray.includes(item._id.toString()));

		return possibleWordsArray
	}
}

module.exports = new UserService
