import express from "express"
import multer from "multer"
import { sellerProduct } from "../controllers/sellerProduct.js"

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage })

router.post("/list-product", upload.single('image'), sellerProduct)
// for multiple image
// router.post("/list-product", upload.arrry('image', 5), sellerProduct)

export default router;
