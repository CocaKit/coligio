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
}
module.exports = new UserController()
