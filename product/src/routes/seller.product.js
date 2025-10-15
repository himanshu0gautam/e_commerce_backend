import express from "express"
import multer from "multer"
import { verifySellerProduct } from "../middleware/sellerProduct.middleware.js"
import { sellerProduct, sellerCategory, nestedSubCategory, sellerSubCategory,
         getAllCategory, getSubCategory, getNestedCategory } from "../controllers/sellerProduct.js"

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage })

// router.post("/list-product", upload.single('image'), verifySellerProduct, sellerProduct)
// for multiple image

//Post method = Prefix url => api/seller 
router.post("/seller-category",verifySellerProduct, sellerCategory);
router.post("/seller-subCategory", verifySellerProduct, sellerSubCategory)
router.post("/seller-nestedSubCategory", verifySellerProduct, nestedSubCategory);
router.post("/list-product", verifySellerProduct, upload.array('image', 5), sellerProduct);

// get method
router.get("/all-category", getAllCategory);
router.get("/all-subCategory", getSubCategory);
router.get("/all-nestedCategory", getNestedCategory);


export default router;
