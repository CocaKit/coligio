const {Schema, model} = require('mongoose')

const LevelSchema = new Schema({
	num: {type: Number, unique: true, require: true},
	correctExercisesWords: [String],
	correctTestsWords: [String]
})

module.exports = model('Level', LevelSchema)
