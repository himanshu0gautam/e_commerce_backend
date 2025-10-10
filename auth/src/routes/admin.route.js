const express = require('express')
const adminController = require('../controllers/admin.controller')

const route = express.Router()

route.post('/register', adminController.adminRegisterController)

route.post('/login', adminController.adminLoginController)

route.post('/getAllSeller', adminController.getAllseller)

route.patch('/approveSeller/:sellerId', adminController.approveSeller)

route.post('/rejectSeller/:sellerId', adminController.rejectSeller)

module.exports = route