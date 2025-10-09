import express from 'express';  
import sellerProductRoute from "./src/routes/seller.product.js"
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("okkkk")
});


app.use("/api/seller", sellerProductRoute)


export {app};