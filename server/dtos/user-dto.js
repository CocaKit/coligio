class UserDto {
	constructor(model) {
		this.id = model._id
		this.nickname = model.nickname
		this.email = model.email
		this.isActivated = model.isActivated
		this.level = model.level
		this.words = model.words
	}
}

module.exports = UserDto
