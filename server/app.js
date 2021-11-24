const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/error-middleware')

require('dotenv').config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))
app.use('/api', router)
app.use(errorMiddleware)

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
