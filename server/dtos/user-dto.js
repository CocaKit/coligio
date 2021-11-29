class UserDto {
	constructor(model) {
		this.id = model._id
		this.nickname = model.nickname
		this.email = model.email
		this.isActivated = model.isActivated
		this.level = model.level
	}
}

module.exports = UserDto
