const DictionaryModel = require('../models/dictionary-model')

class DictionaryService {
	async addWord(russianWord, englishWord){
		const word = await DictionaryModel.create({russianWord, englishWord})
		return word
	}

	async addManyWords(arr){
		const asn = await DictionaryModel.create(arr)
		return asn
	}

	async deleteWord(englishWord){
		const word = await DictionaryModel.findOne({englishWord})
		if (!word) {
			throw ApiError.badRequestError(`word ${englishWord} dont exists.`)
		}
		const res = await DictionaryModel.deleteOne({word})
		return word
	}

	async getWords() {
		const words = await DictionaryModel.find()
		return words
	}

	async reset(arr) {
		await DictionaryModel.deleteMany()

		const words = await DictionaryModel.create(arr)
		return words
	}
}

module.exports = new DictionaryService()
