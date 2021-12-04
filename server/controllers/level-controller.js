const LevelService = require("../service/level-service")
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class LevelController{
	async getLevelCorrectExercisesWords(req, res, next){
		try {
			const {num} = req.body
			const levelInfo = await LevelService.getLevelCorrectExercisesWords(num)
			return res.json(levelInfo)
		}
		catch(e){
			next(e)
		}
	}

	async getLevelCorrectTestsWords(req, res, next){
		try {
			const {num} = req.body
			const levelInfo = await LevelService.getLevelCorrectTestsWords(num)
			return res.json(levelInfo)
		}
		catch(e){
			next(e)
		}
	}

	async reset(req, res, next) {
		try {
			const validationErrors = validationResult(req)
			if (!validationErrors.isEmpty()){
				return next(ApiError.badRequestError("Invalid input data", validationErrors.array()))
			}

			const arr = req.body
			const levels = await LevelService.reset(arr)
			return res.json(levels)
		}
		catch(e) {
			next(e)
		}
	}
}

module.exports = new LevelController()
