var express = require('express')
var app = express()
var cors = require('cors')
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose')
const router = require('./routes/index')

require('dotenv').config()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)

const PORT = process.env.PORT || 4000

var start = async () => {
	await mongoose.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	try {
		app.listen(PORT, () => console.log(`Server working on port ${PORT}`))

	}
	catch (e) {
		console.log(e)
	}
}

start()
