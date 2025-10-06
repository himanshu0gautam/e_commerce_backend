import { pool } from '../db/db.js'
import { imagekit } from "../services/services.js"

async function sellerProduct(req, res) {

    try {

        const {
            seller_id,
            product_name,
            category,
            subcategory_id,
            brand,
            location_city,
            location_state,
            location_country,
            gst_verified,
            price_value,
            price_unit,
            product_date } = req.body;

        // not use     sku, rating_avg, rating_count, price_currency, request_callback, add_to_wishlist,

        // handle single or multiple files
        let file;
        if (req.file) {
            file = req.file;
        } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            file = req.files[0];
        }

        if (!file) {
            return res.status(400).json({ message: 'no file uploaded' })
        }

        // convert to base64 safely
        const file64 = file.buffer.toString("base64");
        if (!file64) {
            return res.status(400).json({ message: 'File buffer is empty' });
        }
        const dataURI = `data:${file.mimetype};base64,${file64}`;

        // upload to ImageKit
        const result = await imagekit.upload({
            file: dataURI,
            fileName: file.originalname,
            folder: '/producsts',
            useUniqueFileName: true
        });

        const [insertResult] = await pool.query(
            `INSERT INTO product 
            (seller_id, product_name, category, subcategory_id, brand, location_city, location_state, location_country, gst_verified, price_value, price_unit, product_date, product_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [seller_id, product_name, category, subcategory_id, brand, location_city, location_state, location_country, gst_verified, price_value, price_unit, product_date, result.url]
        );

        const [newProductRows] = await pool.query(
            `SELECT * FROM product WHERE product_id = ?`,
            [insertResult.insertId]
        );

        res.json({
            message: "product created successfully",
            sellerProduct:  newProductRows[0],
            url: result.url,
            // fileId: result.product_url,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'seller-Product failed' })
    }

}


async function getsellerProduct(req, res) {
    
}


export { sellerProduct }