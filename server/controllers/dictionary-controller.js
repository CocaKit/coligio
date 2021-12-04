const DictionaryService = require('../service/dictionary-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
require('dotenv').config()

class DictionaryController {
	async addWord(req, res, next){
		try {
			const validationErrors = validationResult(req)
			if (!validationErrors.isEmpty()){
				return next(ApiError.badRequestError("Invalid input data", validationErrors.array()))
			}
			const {russianWord, englishWord} = req.body
			const word = await DictionaryService.addWord(russianWord, englishWord)
			return res.json(word)
		}
		catch(e) {
			next(e)
		}
	}

	async addManyWords(req, res, next) {
		try {
			const validationErrors = validationResult(req)
			if (!validationErrors.isEmpty()){
				return next(ApiError.badRequestError("Invalid input data", validationErrors.array()))
			}
			const arr = req.body
			const ans = await DictionaryService.addManyWords(arr)
			console.log(arr)
			return res.json(ans)
		}
		catch(e) {
			next(e)
		}
	}

	async deleteWord(req, res, next){
		try {
			const {englishWord} = req.body
			const word = await DictionaryService.deleteWord(englishWord)
			return res.json(englishWord)
		}
		catch(e) {
			next(e)
		}
	}

	async getWords(req, res, next){
		try {
			const words = await DictionaryService.getWords()
			return res.json(words)
		}
		catch(e) {
			next(e)
		}
	}
	async reset(req, res, next){
		try {
			const validationErrors = validationResult(req)
			if (!validationErrors.isEmpty()){
				return next(ApiError.badRequestError("Invalid input data", validationErrors.array()))
			}

			const arr = req.body
			const words = await DictionaryService.reset(arr)
			return res.json(words)
		}
		catch(e){
			next(e)
		}
	}
}

module.exports= new DictionaryController()
