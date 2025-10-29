const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerDocs = require('./swagger/swagger')

const app = express();

/* ROUTES */
const authRoute = require("./routes/auth.route");
const sellerRoute = require("./routes/seller.route");
const adminRoute = require("../src/routes/admin.route");

/* Parsers */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: 'http://localhost:5173', // frontend URL
    origin: ["http://192.168.1.48:5173","http://192.168.1.49:5173","http://192.168.1.51:5173", "http://localhost:5173","http://172.31.0.1:5173"],
    credentials: true,
  })
);

/* Routes */
app.use("/api/auth", authRoute);
app.use("/api/auth/seller", sellerRoute);
app.use("/api/admin", adminRoute);

/* Optional: catch-all for preflight requests */

swaggerDocs(app)

module.exports = app;
