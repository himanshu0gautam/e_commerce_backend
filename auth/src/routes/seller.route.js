const express = require('express')

const authenticatemiddleware = require('../middlewares/auth.middleware')

const sellerController = require('../controllers/sellerAuth.controller')

const sellerOptController = require('../controllers/sellerOpt.controller')

const router = express.Router()


/*REGISTSER SELLER SECTION */

<<<<<<< HEAD
router.post('/seller-register-send-otp',sellerOptController.sellerRegisterSendOTP)

router.post('/seller-register-verify-opt',sellerOptController.sellerRegisterVerifyOTP)

router.post('/seller-register-send-email-otp',sellerOptController.sellerRegisterSendEmailOTP)

router.post('/seller-register-verify-email-otp',sellerOptController.sellerRegisterVerifyEmailOTP)

router.post('/register',sellerController.sellerRegistration)

=======
/**
 * @swagger
 * /api/auth/seller-register-send-otp:
 *   post:
 *     summary: Send OTP during seller registration
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post('/seller-register-send-otp',sellerOptController.sellerRegisterSendOTP)

/**
 * @swagger
 * /api/auth/seller-register-verify-opt:
 *   post:
 *     summary: Verify seller registration OTP
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post('/seller-register-verify-opt',sellerOptController.sellerRegisterVerifyOTP)

/**
 * @swagger
 * /api/auth/seller-register-send-email-otp:
 *   post:
 *     summary: Send email OTP during seller registration
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email OTP sent
 */
router.post('/seller-register-send-email-otp',sellerOptController.sellerRegisterSendEmailOTP)

/**
 * @swagger
 * /api/auth/seller-register-verify-email-otp:
 *   post:
 *     summary: Verify seller registration email OTP
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email OTP verified
 */
router.post('/seller-register-verify-email-otp',sellerOptController.sellerRegisterVerifyEmailOTP)

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a seller account
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seller registered
 */
router.post('/register',sellerController.sellerRegistration)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Seller login
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
>>>>>>> 9626cc7c1824c10d0a7adcfd824fdf86643cb558
router.post('/login',sellerController.sellerLogin)


/*LOGIN SELLER SECTION */

<<<<<<< HEAD
/* /api/auth/seller/send-otp */
router.post('/send-otp',sellerOptController.sellerSendOtp)

router.post('/verfy-otp',sellerOptController.sellerVerifyOtp)

router.post('/forget-password',sellerController.sellerForgotPassword)

/* /api/auth/verify-Forgot-Otp */
router.post('/verify-Forgot-Otp',sellerOptController.sellerVerifyForgotOtp)

/* /api/auth/reset-password */
router.post('/reset-password',sellerController.sellerResetPassword)

router.get('/seller-data',authenticatemiddleware.sellerAuthMiddleware,sellerController.getsellerData)

router.get('/all-seller',sellerController.getallsellers)
=======

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP for seller login/verification
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post('/send-otp',sellerOptController.sellerSendOtp)

/**
 * @swagger
 * /api/auth/verfy-otp:
 *   post:
 *     summary: Verify OTP for seller
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post('/verfy-otp',sellerOptController.sellerVerifyOtp)

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Seller request password reset
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset OTP/code sent
 */
router.post('/forget-password',sellerController.sellerForgotPassword)

/* /api/auth/verify-Forgot-Otp */

/**
 * @swagger
 * /api/auth/verify-Forgot-Otp:
 *   post:
 *     summary: Verify seller forgot-password OTP
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verified
 */
router.post('/verify-Forgot-Otp',sellerOptController.sellerVerifyForgotOtp)

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset seller password
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-password',sellerController.sellerResetPassword)

/**
 * @swagger
 * /api/auth/seller-data:
 *   get:
 *     summary: Get data for authenticated seller
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller data returned
 *       401:
 *         description: Unauthorized
 */
router.get('/seller-data',authenticatemiddleware.sellerAuthMiddleware,sellerController.getsellerData)

>>>>>>> 9626cc7c1824c10d0a7adcfd824fdf86643cb558

module.exports = router