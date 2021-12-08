const nodemailer = require('nodemailer')
require('dotenv').config()

class EmailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		})
	}

	async sendActivationLink(catcher, link){
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to: catcher,
			subject: `Activazion from ${process.env.API_URL}`,
			text: '',
			html:`<div><h1>"Activation link"</h1><a href=${link}>${link}</a></div>`,
		})
	}
}

module.exports = new EmailService
