const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const cors = require('cors')

/*IMPORT ROUTES*/
const authRoute= require('./routes/auth.route')
const sellerRoute = require('../src/routes/seller.route')
const adminRoute = require('../src/routes/admin.route')


/*USE MIDDLEWARE */
app.use(express.json())

/*USE ROUTES */
app.use('/api/auth',authRoute)
app.use('/api/auth/seller',sellerRoute)
app.use('/api/auth/admin', adminRoute)

module.exports = app