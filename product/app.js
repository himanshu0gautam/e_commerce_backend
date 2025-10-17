import express from 'express';
import cors from 'cors'  
import sellerProductRoute from "./src/routes/seller.product.js"
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://192.168.1.59:5173",
        "http://192.168.1.59:3000",
        "http://192.168.1.59:3001",
        "http://localhost:5173"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("done")
});


app.use("/api/seller", sellerProductRoute)


export {app};