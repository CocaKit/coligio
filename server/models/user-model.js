const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
	nickname: {type: String, unique: true, required: true},
	email: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	isActivated: {type: Boolean, default: false},
	activationLink: {type: String},
	level: {type: Number, default: 1}
})

module.exports = model('User', UserSchema)
