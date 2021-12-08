const LevelModel = require('../models/level-model')
const UserModel = require('../models/user-model')
const ApiError = require('../exceptions/api-error')
require('dotenv').config()

class LevelService {

	async getLevelCorrectExercisesWords(num) {
		console.log(num)
		const level = await LevelModel.findOne({num})
		if (!level){
			throw ApiError.badRequestError(`level ${num} dont exists.`)
		}
		const words = level.correctExercisesWords
		return words
	}

	async getLevelCorrectTestsWords(num) {
		const level = await LevelModel.findOne({num})
		if (!level){
			throw ApiError.badRequestError(`level ${num} dont exists.`)
		}
		const words = level.correctTestsWords
		return words
	}

	async reset(arr) {
		await LevelModel.deleteMany()

		const levels = await LevelModel.create(arr)
		return levels
	}

	async addComment(num, idUser, message) {
		const level = await LevelModel.findOne({num})
		if (!level){
			throw ApiError.badRequestError(`level ${num} dont exists.`)
		}

		const user = await UserModel.findById(idUser)
		if (!user){
			throw ApiError.badRequestError(`User with id ${idUser} dont exists.`)
		}

		const now = new Date()
		const date = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const commentsArray = level.comments
		commentsArray.push({'idUser': idUser, 'message': message, 'date': date})

		level.comments = commentsArray
		level.save()
		return commentsArray
	}

	async showComment(num) {
		const level = await LevelModel.findOne({num})
		if (!level){
			throw ApiError.badRequestError(`level ${num} dont exists.`)
		}

		const commentsArray = level.comments
		return commentsArray
	}
}

module.exports = new LevelService()
