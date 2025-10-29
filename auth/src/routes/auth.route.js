const express = require('express')
const authenticatemiddleware = require('../middlewares/auth.middleware')

/*IMPORT VALIDATIONS */
const authValidation= require('../middlewares/authValidation.middleware')

/*IMPORT CONTROLLERS */
const authControlers = require('../controllers/auth.controller')
const optControlers = require('../controllers/opt.controller')

const route = express.Router()

<<<<<<< HEAD
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

/* /api/auth/verify-Forgot-Otp */
route.post('/verify-Forgot-Otp',optControlers.verifyForgotOtp)

/* /api/auth/reset-password */
route.post('/reset-password',authControlers.resetPassword)

/* /api/auth/me */
route.get('/me',authenticatemiddleware.authMiddleware,authControlers.getUsers)

/* /api/auth/address */
route.post('/address',authenticatemiddleware.authMiddleware,authControlers.addUserAddress)

/* /api/auth/getallAddress */
route.get('get-user-all-address',authenticatemiddleware.authMiddleware,authControlers.addUserAddress)

route.delete('/address/:address_id',authenticatemiddleware.authMiddleware,authControlers.deleteUserAddress)

/* /api/auth/allusers */
=======
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
route.post('/register',authValidation.registerUserValidator,authControlers.registerController)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Auth
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
 *       401:
 *         description: Invalid credentials
 */
route.post('/login',authValidation.loginValidation,authControlers.loginController)

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to user phone/email for verification
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */
route.post('/send-otp',optControlers.sendOtp)

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP sent to user
 *     tags:
 *       - Auth
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
 *       400:
 *         description: Invalid OTP
 */
route.post("/verify-otp",optControlers.verifyOtp)

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout current user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
route.get('/logout',authControlers.logout)

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Request password reset (send OTP or email code)
 *     tags:
 *       - Auth
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
route.post('/forget-password',authControlers.forgotPassword)

/**
 * @swagger
 * /api/auth/verify-Forgot-Otp:
 *   post:
 *     summary: Verify OTP/code for password reset
 *     tags:
 *       - Auth
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
 *         description: Verified, can reset password
 */
route.post('/verify-Forgot-Otp',optControlers.verifyForgotOtp)

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password after OTP verification
 *     tags:
 *       - Auth
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
route.post('/reset-password',authControlers.resetPassword)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile returned
 *       401:
 *         description: Unauthorized
 */
route.get('/me',authenticatemiddleware.authMiddleware,authControlers.getUsers)

/**
 * @swagger
 * /api/auth/address:
 *   post:
 *     summary: Add an address for the authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address added
 */
route.post('/address',authenticatemiddleware.authMiddleware,authControlers.addUserAddress)

/**
 * @swagger
 * /api/auth/get-user-all-address:
 *   get:
 *     summary: Get all addresses of the authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user addresses
 */
route.get('/get-user-all-address',authenticatemiddleware.authMiddleware,authControlers.addUserAddress)

/**
 * @swagger
 * /api/auth/address/{address_id}:
 *   delete:
 *     summary: Delete a user address by ID
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID to delete
 *     responses:
 *       200:
 *         description: Address deleted
 *       404:
 *         description: Address not found
 */
route.delete('/address/:address_id',authenticatemiddleware.authMiddleware,authControlers.deleteUserAddress)

/**
 * @swagger
 * /api/auth/allusers:
 *   get:
 *     summary: Get all users (public)
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: List of all users
 */
>>>>>>> 9626cc7c1824c10d0a7adcfd824fdf86643cb558
route.get("/allusers",authControlers.getAllUsers)

module.exports = route