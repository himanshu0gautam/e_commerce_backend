import express from "express"
import multer from "multer"
import { imageLimiter } from "../middleware/imageLimit.js"
import { verifySellerProduct } from "../middleware/sellerProduct.middleware.js"
import { sellerProduct, sellerCategory, nestedSubCategory, sellerSubCategory,
         getAllCategory, getSubCategory, getNestedCategory, getAllProduct, sellerImage,
        getImageUrl } from "../controllers/sellerProduct.js"




const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage })

// router.post("/list-product", upload.single('image'), verifySellerProduct, sellerProduct)
// for multiple image

//Post method = Prefix url => api/seller 
router.post("/seller-category", sellerCategory);
router.post("/seller-subCategory", sellerSubCategory)
router.post("/seller-nestedSubCategory", nestedSubCategory);
router.post("/list-product", verifySellerProduct, sellerProduct);
router.post("/add-image", verifySellerProduct, upload.array('image', 5), sellerImage);

// get method
router.get("/all-category", getAllCategory);
router.get("/all-subCategory", getSubCategory);
router.get("/all-nestedCategory", getNestedCategory);
router.get("/all-product",  verifySellerProduct, getAllProduct)
router.get("/all-product-image", imageLimiter, getImageUrl)


export default router;
