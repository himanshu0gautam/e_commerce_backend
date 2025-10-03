const express = require('express')
const multer = require("multer");
const upload = multer(); 
/*IMPORT VALIDATIONS */
const authValidation= require('../middlewares/authValidation.middleware')

/*IMPORT CONTROLLERS */
const authControlers = require('../controllers/auth.controller')
const optControlers = require('../controllers/opt.controller')

const route = express.Router()

route.post('/register',authValidation.registerUserValidator,authControlers.registerController)

route.post('/login',authValidation.loginValidation,authControlers.loginController)

route.post('/send-otp', upload.none(),optControlers.sendOtpController)

module.exports = route