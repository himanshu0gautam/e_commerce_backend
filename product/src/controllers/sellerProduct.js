import { pool } from '../db/db.js'
import { imagekit } from "../services/services.js"

async function sellerProduct(req, res) {

    try {

        const { product_name, category, subcategory_id, brand, location_city,
            location_state, location_country, gst_verified, price_value,
            price_unit, product_date } = req.body;
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

        const sellerProduct = await pool.query(
            `INSERT INTO product 
            (product_name, category, subcategory_id, brand, location_city, location_state, location_country, gst_verified, price_value, price_unit, product_date, product_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [product_name, category, subcategory_id, brand, location_city, location_state, location_country, gst_verified, price_value, price_unit, product_date, result.url, result.product_url]
        );

        res.json({
            message: "product created successfully",
            sellerProduct,
            url: result.url,
            fileId: result.product_url,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'seller-Product failed' })
    }

}

export { sellerProduct }