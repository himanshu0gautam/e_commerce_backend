const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const cors = require('cors')

/*IMPORT ROUTES*/
const authRoute= require('./routes/auth.route')
const sellerRoute = require('../src/routes/seller.route')


/*USE MIDDLEWARE */
app.use(express.json())

/*USE ROUTES */
app.use('/api/auth',authRoute)
app.use('/api/auth/seller',sellerRoute)

module.exports = app