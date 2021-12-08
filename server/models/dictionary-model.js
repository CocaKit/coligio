const {Schema, model} = require('mongoose')

const DictionarySchema = new Schema({
	russianWord: {type: String, require: true},
	englishWord: {type: String, require: true, unique: true},
})

module.exports = model('Dictionary', DictionarySchema)
