const express = require("express");
const adminController = require("../controllers/admin.controller");

const route = express.Router();

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags:
 *       - Admin
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
 *                 example: Kunal Boat
 *               email:
 *                 type: string
 *                 example: kunal@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Admin already registered
 *       500:
 *         description: Internal server error
 */
route.post("/register", adminController.adminRegisterController);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
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
route.post("/login", adminController.adminLoginController);

// /**
//  * @swagger
//  * /admin/get-single-Seller:
//  *   get:
//  *     summary: Get a single seller details
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: query
//  *         name: sellerId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Seller ID to fetch
//  *     responses:
//  *       200:
//  *         description: Seller data fetched successfully
//  *       404:
//  *         description: Seller not found
//  */
// // route.get("/get-single-Seller", adminController.getSingleSeller);

/**
 * @swagger
 * /api/admin/all-seller?page=1&limit=10:
 *   get:
 *     summary: Get all sellers
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: All sellers data fetched successfully
 */
route.get("/all-seller", adminController.getallsellers);

/**
 * @swagger
 * /api/admin/approveSeller/{sellerId}:
 *   patch:
 *     summary: Approve a seller
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Seller ID to approve
 *     responses:
 *       200:
 *         description: Seller approved successfully
 */
route.patch("/approveSeller/:sellerId", adminController.approveSeller);

/**
 * @swagger
 * api//admin/rejectSeller/{sellerId}:
 *   post:
 *     summary: Reject a seller
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Seller ID to reject
 *     responses:
 *       200:
 *         description: Seller rejected successfully
 */
route.patch("/rejectSeller/:sellerId", adminController.rejectSeller);

route.get('/single-seller/:sellerId',adminController.getSingleSeller)

route.get('/statusCount',adminController.getApprovedAndRejectCount)

module.exports = route;
