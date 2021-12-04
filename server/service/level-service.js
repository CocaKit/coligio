const LevelModel = require('../models/level-model')
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
}

module.exports = new LevelService()
