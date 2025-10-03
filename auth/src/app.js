const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()

/*IMPORT ROUTES*/
const authRoute= require('./routes/auth.route')



/*USE MIDDLEWARE */
app.use(express.json())
app.use(cookieParser())

/*USE ROUTES */
app.use('/api/auth',authRoute)

module.exports = app