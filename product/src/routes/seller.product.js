import express from "express"
import multer from "multer"
import { sellerProduct, sellerCategory, nestedSubCategory, sellerSubCategory } from "../controllers/sellerProduct.js"
import { verifySellerProduct } from "../middleware/sellerProduct.middleware.js"

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage })

// router.post("/list-product", upload.single('image'), verifySellerProduct, sellerProduct)
// for multiple image

router.post("/seller-category", verifySellerProduct, sellerCategory);
router.post("/seller-subCategory", verifySellerProduct, sellerSubCategory)
router.post("/seller-nestedSubCategory", verifySellerProduct, nestedSubCategory);
router.post("/list-product", verifySellerProduct, upload.array('image', 5), sellerProduct);

export default router;
