const {Schema, model} = require('mongoose')

const LevelSchema = new Schema({
	num: {type: Number, unique: true, require: true},
	correctExercisesWords: [String],
	correctTestsWords: [String],
	comments: [{
		idUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
		message: {type: String, required: true},
		date: {type: Date, required: true}
	}]
})

module.exports = model('Level', LevelSchema)
