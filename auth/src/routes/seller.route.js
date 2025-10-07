const express = require('express')

const authenticatemiddleware = require('../middlewares/auth.middleware')

const sellerController = require('../controllers/sellerAuth.controller')

const sellerOptController = require('../controllers/sellerOpt.controller')

const router = express.Router()

router.post('/register',sellerController.sellerRegistration)

router.post('/login',sellerController.sellerLogin)

/* /api/auth/send-otp */
router.post('/send-otp',sellerOptController.sellerSendOtp)

router.post('/verfy-otp',sellerOptController.sellerVerifyOtp)

router.post('/forget-password',sellerController.sellerForgotPassword)

/* /api/auth/verify-Forgot-Otp */
router.post('/verify-Forgot-Otp',sellerOptController.sellerVerifyForgotOtp)

/* /api/auth/reset-password */
router.post('/reset-password',sellerController.sellerResetPassword)

router.get('/seller-data',authenticatemiddleware.sellerAuthMiddleware,sellerController.getsellerData)

router.get('/all-seller',sellerController.getallsellers)

module.exports = router