const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/* ROUTES */
const authRoute = require("./routes/auth.route");
const sellerRoute = require("./routes/seller.route");
const adminRoute = require('../src/routes/admin.route')


/* Parsers */
app.use(cookieParser());
app.use(express.json({ strict: true }));
// app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://unhortative-mayola-unsavagely.ngrok-free.dev",
    "http://localhost:3001",
    "http://192.168.1.59:3000",   // 👈 add your IPv4 frontend
    "http://192.168.1.59:3001"    // 👈 add IPv4 for second server if needed
  ],
  credentials: true
}));




/* Routes */
app.use("/api/auth", authRoute);
app.use("/api/auth/seller", sellerRoute);
app.use('/api/admin',adminRoute)

/* Optional: catch-all for preflight requests */


module.exports = app;
