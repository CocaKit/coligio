class UserDto {
	constructor(model) {
		this.id = model._id
		this.nickname = model.nickname
		this.password = model.password
		this.isActivated = model.isActivated
	}
}

module.exports = UserDto
