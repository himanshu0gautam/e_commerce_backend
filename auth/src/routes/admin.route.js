const express = require('express')
const adminController = require('../controllers/admin.controller')

const route = express.Router()

route.post('/register', adminController.adminRegisterController)

route.post('/login', adminController.adminLoginController)

route.post('/getAllSeller', adminController.getAllseller)

route.post('/approveSeller', adminController.approveSeller)

route.post('/rejectSeller', adminController.rejectSeller)


module.exports = route