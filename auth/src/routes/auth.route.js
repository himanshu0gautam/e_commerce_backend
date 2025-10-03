const express = require('express')
const multer = require("multer");
const upload = multer(); 
/*IMPORT VALIDATIONS */
const authValidation= require('../middlewares/authValidation.middleware')

/*IMPORT CONTROLLERS */
const authControlers = require('../controllers/auth.controller')
const optControlers = require('../controllers/opt.controller')

const route = express.Router()

/* /api/auth/register */
route.post('/register',authValidation.registerUserValidator,authControlers.registerController)

/* /api/auth/login */
route.post('/login',authValidation.loginValidation,authControlers.loginController)

/* /api/auth/send-otp */
route.post('/send-otp',optControlers.sendOtp)

/* /api/auth/verify-otp */
route.post("/verify-otp",optControlers.verifyOtp)

/* /api/auth/login */
route.get('/logout',authControlers.logout)

/* /api/auth/forgetpassword */
route.post('/forget-password',authControlers.forgotPassword)

/* /api/auth//verify-Forgot-Otp */
route.post('/verify-Forgot-Otp',optControlers.verifyForgotOtp)

/* /api/auth///reset-password */
route.post('/reset-password',authControlers.resetPassword)

module.exports = route