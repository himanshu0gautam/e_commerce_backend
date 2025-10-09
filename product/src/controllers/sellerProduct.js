import { pool } from '../db/db.js'

import connectDb from "../db/db.js";

import { uploadImage } from "../services/services.js";


async function sellerCategory(req, res) {  

  try {

    const db = await connectDb();

    const { category_name, description } = req.body;
    
    console.log(req.seller);
    const { id: seller_id, fullname: seller_name } = req.seller;


    if (!category_name) {
      return res.status(401).json({ message: "Category name is required" });
    }

    const [result] = await db.query(
      `INSERT INTO category 
    (seller_id, seller_name, category_name, description) 
    VALUES (?, ?, ?, ?)`,
      [
        seller_id,
        seller_name,
        category_name,
        description
      ]
    );

    const [newCategoryRows] = await db.query(
      `SELECT * FROM category WHERE category_id = ?`,
      [result.insertId]
    );

    res.status(200).json({
      message: "category add successfull",
      sellerCategory: newCategoryRows[0]
    })

  } catch (error) {
    console.error("Error creating seller Category:", error);
    res.status(500).json({ message: "Seller category creation failed" });
  }

}

async function sellerSubCategory(req, res) {
  res.send("done hai")
}

async function sellerProduct(req, res) {
  try {
    const db = await connectDb();
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
      product_date
    } = req.body;

    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload all images
    const uploadedFiles = await Promise.all(files.map(file => uploadImage(file)));
    const product_url = uploadedFiles.map(f => f.url); // array of URLs

    // Insert product
    const [insertResult] = await db.query(
      `INSERT INTO product 
       (seller_id, product_name, category, subcategory_id, brand, location_city, location_state, location_country, gst_verified, price_value, price_unit, product_date, product_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        product_date,
        JSON.stringify(product_url), // store as JSON array
      ]
    );

    // Fetch the inserted product
    const [newProductRows] = await db.query(
      `SELECT * FROM product WHERE product_id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      message: "Product created successfully",
      sellerProduct: newProductRows[0],
      product_url,
    });

  } catch (error) {
    console.error("Error creating seller product:", error);
    res.status(500).json({ message: "Seller product creation failed" });
  }
}



// async function getsellerProduct(req, res) {

// }


export { sellerProduct, sellerCategory, sellerSubCategory }