const UserService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
require('dotenv').config()

class UserController {
	async registration(req, res, next){
		try {
			const validationErrors = validationResult(req)
			if (!validationErrors.isEmpty()){
				return next(ApiError.badRequestError("Invalid input data", validationErrors.array()))
			}
			const {nickname, email, password} = req.body
			const userData = await UserService.registration(nickname, email, password)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
			return res.json(userData)
		}
		catch(e) {
			next(e)
		}
	}
	async login(req, res, next){
		try {
			const {email, password} = req.body
			const userData = await UserService.login(email, password)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
			return res.json(userData)
		}
		catch(e) {
			next(e)
		}
	}
	async logout(req, res, next){
		try {
			const {refreshToken} = req.cookies
			const token = await UserService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json(refreshToken)
		}
		catch(e) {
			next(e)
		}
	}
	async activate(req, res, next){
		try {
			const activationLink = req.params.link
			console.log(activationLink)
			await UserService.activate(activationLink)
			return res.redirect(process.env.CLIENT_URL)
		}
		catch(e) {
			next(e)
		}
	}
	async refresh(req, res, next){
		try {
			const {refreshToken} = req.cookies
			const userData = await UserService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
			return res.json(userData)

		}
		catch(e) {
			next(e)
		}
	}
	async getUsers(req, res, next){
		try {
			const users = await UserService.getUsers()
			return res.json(users)
		}
		catch(e) {
			next(e)
		}
	}

	async editUser(req, res, next){
		try {
			const validationErrors = validationResult(req)
			if (!validationErrors.isEmpty()){
				return next(ApiError.badRequestError("Invalid input data", validationErrors.array()))
			}
			const {id, nickname, level} = req.body
			const userData = await UserService.editUser(id, nickname, level)
			return res.json(userData)

		}
		catch(e) {
			next(e)
		}
	}

	async editPassword(req, res, next){
		try {
			const validationErrors = validationResult(req)
			if (!validationErrors.isEmpty()){
				return next(ApiError.badRequestError("Invalid input data", validationErrors.array()))
			}
			const {id, oldPassword, newPassword} = req.body
			const userData = await UserService.editPassword(id, oldPassword, newPassword)
			return res.json(userData)
		}
		catch(e) {
			next(e)
		}
	}

	async addWordToPersonal(req, res, next) {
		try {
			const validationErrors = validationResult(req)
			if (!validationErrors.isEmpty()){
				return next(ApiError.badRequestError("Invalid input data", validationErrors.array()))
			}
			const {userId, wordId, nextDays} = req.body
			const user = await UserService.addWordToPersonal(userId, wordId, nextDays)
			return res.json(user)
		}
		catch(e) {
			next(e)
		}
	}

	async deleteWordFromPersonal(req, res, next) {
		try {
			const {userId, wordId} = req.body
			const user = await UserService.deleteWordFromPersonal(userId, wordId)
			return res.json(user)
		}
		catch(e) {
			next(e)
		}
	}

	async getTodayWords(req, res, next) {
		try {
			const {userId} = req.body
			const words = await UserService.getTodayWords(userId)
			return res.json(words)
		}
		catch(e) {
			next(e)
		}
	}

	async getPossibleWords(req, res, next) {
		try {
			const {userId} = req.body
			const words = await UserService.getPossibleWords(userId)
			return res.json(words)
		}
		catch(e) {
			next(e)
		}
	}
}
module.exports = new UserController()
