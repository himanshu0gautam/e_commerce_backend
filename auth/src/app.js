const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

<<<<<<< HEAD
const app = express();

/* ROUTES */
const authRoute = require("./routes/auth.route");
const sellerRoute = require("./routes/seller.route");
=======
/*IMPORT ROUTES*/
const authRoute= require('./routes/auth.route')
const sellerRoute = require('../src/routes/seller.route')
>>>>>>> 5378e8e1ec91f2cc1f1916061a44055033cc3dec
const adminRoute = require('../src/routes/admin.route')


/* Parsers */
app.use(cookieParser());
app.use(express.json({ strict: true }));
// app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:["http://localhost:5173","https://unhortative-mayola-unsavagely.ngrok-free.dev/"],
  credentials:true
}))

<<<<<<< HEAD
/* Routes */
app.use("/api/auth", authRoute);
app.use("/api/auth/seller", sellerRoute);
app.use('/api/admin',adminRoute)
=======
/*USE ROUTES */
app.use('/api/auth',authRoute)
app.use('/api/auth/seller',sellerRoute)
app.use('/api/auth/admin', adminRoute)
>>>>>>> 5378e8e1ec91f2cc1f1916061a44055033cc3dec

/* Optional: catch-all for preflight requests */


module.exports = app;
