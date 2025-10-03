import express from 'express';  
import sellerProductRoute from "./src/routes/seller.product.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("okk")
});


app.use("/api/seller", sellerProductRoute)


export {app};