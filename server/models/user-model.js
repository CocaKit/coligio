const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
	nickname: {type: String, unique: true, required: true},
	email: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	isActivated: {type: Boolean, default: false},
	activationLink: {type: String},
	level: {type: Number, default: 0},
	words: [{
		idWord : {type: Schema.Types.ObjectId, ref: 'Dictionary', required: true},
		nextDate : {type : Date, required: true},
		daysPassed : {type : Number, default: 0},
		accessDays : {type : Number},
		failDays : {type : Number}
	}]
})

module.exports = model('User', UserSchema)
