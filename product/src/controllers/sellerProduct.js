import { pool } from "../db/db.js";

import connectDb from "../db/db.js";

import { uploadImage } from "../services/services.js";


async function sellerCategory(req, res, next) {

  try {
    const db = await connectDb();

    const { id: seller_id, fullname: seller_name } = req.seller;

    const { category_name, description } = req.body;

    if (!category_name) {
      return res.status(401).json({ message: "Category name is required" });
    }

    const allowedCategory = ['fashion', 'electronic', 'grosery', 'other'];

    if (!allowedCategory.includes(category_name)) {
      return res.status(401).json({ message: `Invalid category Choose one of: ${allowedCategory.join(', ')}` });
    }

    const [existing] = await db.query('SELECT COUNT(*) AS count FROM category WHERE seller_id = ?',
      [seller_id]);

    if (existing[0].count >= 3) {
      return res.status(400).json({ message: "You can only add up to 3 categories" });
    }

    const [result] = await db.query(
      `INSERT INTO category(seller_id, seller_name, category_name,description) VALUES (?, ?, ?, ?)`,
        [seller_id, seller_name, category_name, description]
    );

    const [newCategoryRows] = await db.query(
      'SELECT * FROM category WHERE id = ?',
      [result.insertId]
    );

    res.status(200).json({
      message: "category add successfull",
      sellerCategory: newCategoryRows[0],
    });
  } catch (error) {
    console.error("Error creating seller Category:", error);
    res.status(500).json({ message: "Seller category creation failed" });
  }
}

async function sellerSubCategory(req, res) {

  try {

    const db = await connectDb();

    //const { category_name, sub_cat_name, description } = req.body;    //category_name sa sub_category create kreaga
    const { sub_cat_name, description } = req.body;     // auto detect the latest category add

    const { id: seller_id } = req.seller;

    if (!sub_cat_name) {
      return res.status(401).json({ message: "sub-category name are required" })
    }

    const [category] = await db.query
      ("SELECT id, category_name FROM mojija_product.category WHERE seller_id = ? ORDER BY id DESC LIMIT 1", [seller_id]);

    if (category.length === 0) {
      return res.status(404).json({ message: "Category not found for this seller" })
    }

    const category_id = category[0].id;
    const category_name = category[0].category_name;

    const [result] = await db.query
      (`INSERT INTO sub_category (seller_id, category_id, sub_cat_name, description) VALUE (?, ?, ?, ?)`,
        [seller_id, category_id, sub_cat_name, description]
      );

    const [newSubCategory] = await db.query(
      `SELECT * FROM sub_category WHERE id = ?`,
      [result.insertId]);


    res.status(200).json({
      message: "Sub_Category Add successfull",
      sellerSubCategory: newSubCategory[0],
      category_name
    })

  } catch (error) {
    console.error("Error creating seller Sub_Category:", error);
    res.status(500).json({ message: "Seller Sub_Category creation failed" });
  }

}

async function nestedSubCategory(req, res) {

  try {

    const db = await connectDb();

    const { id: seller_id } = req.seller;

    const { nested_sub_cat_name, description } = req.body;

    if (!nested_sub_cat_name) {
      return res.status(401).json({ message: "nested_sub_cat_name is required" })
    }

    const [sub_category] = await db.query
      (`SELECT id, sub_cat_name FROM mojija_product.sub_category WHERE seller_id = ? ORDER BY id DESC LIMIT 1`, [seller_id])    //WHERE ka matlab condition lagana. Yaha sirf wahi rows chahiye jahan seller_id match ho.

    if (sub_category.length === 0) {
      return res.status(404).json({ message: "sub_category is not found this seller" })
    }

    const sub_category_id = sub_category[0].id;
    const subCategory = sub_category[0].sub_cat_name;

    const [result] = await db.query
      ('INSERT INTO nested_sub_category (seller_id, sub_category_id, nested_sub_cat_name, description) VALUE (?, ?, ?, ?)',
        [
          seller_id,
          sub_category_id,
          nested_sub_cat_name,
          description
        ]);

    const [nested_subCategory] = await db.query(`SELECT * FROM mojija_product.nested_sub_category WHERE id =?`,
      [result.insertId]
    )

    res.status(200).json({
      message: "nested_sub_category create successfull",
      nested_sub_cat_name: nested_subCategory[0],
      subCategory
    })

  } catch (error) {
    console.error("Error creating seller nested_Sub_Category:", error);
    res.status(500).json({ message: "Seller nested_Sub_Category creation failed" });
  }
}

async function sellerProduct(req, res) {
  try {
    const db = await connectDb();

    const { id: seller_id } = req.seller;

    const {
      product_name,
      subcategory_id,
      brand,
      location_city,
      location_state,
      location_country,
      gst_verified,
      price_value,
      price_unit,
      product_date,
    } = req.body;

    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload all images
    const uploadedFiles = await Promise.all(files.map(file => uploadImage(file)));
    const product_url = uploadedFiles.map(f => f.optimized_url);

    const [category_id] = await db.query
      ('SELECT id FROM mojija_product.category WHERE seller_id = ? ORDER BY id DESC LIMIT 1', [seller_id])

    if (category_id.length === 0) {
      return res.status(404).json({ message: "Category not found for this seller" })
    }

    const category = category_id[0].id;

    // Insert product
    const [insertResult] = await db.query
      ("INSERT INTO product (seller_id, product_name, category, subcategory_id, brand, location_city, location_state, location_country, gst_verified, price_value, price_unit, product_date, product_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

async function getAllCategory(req, res) {
  try {
    const db = await connectDb();

    const [categoryrows] = await db.query(
      'SELECT category_name FROM mojija_product.category')

    if (categoryrows.length === 0) {
      return res.status(404).json({ message: "Category not found" })
    }

    // 🪄 Extract only category_name values
    const categories = categoryrows.map(row => row.category_name);

    res.status(200).json({ categories })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getSubCategory(req, res) {
  try {
    const db = await connectDb();

    const [rows] = await db.query(
      'SELECT sub_cat_name FROM mojija_product.sub_category'
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "Sub_Category not found" })
    }

    const sub_category = rows.map(row => row.sub_cat_name)

    res.status(200).json({ sub_category })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getNestedCategory(req, res) {
  try {

    const db = await connectDb();

    const [rows] = await db.query(
      "SELECT nested_sub_cat_name FROM mojija_product.nested_sub_category"
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "nested_sub_category not found" })
    }

    const nested_category = rows.map(row => row.nested_sub_cat_name);

    res.status(201).json({ nested_category })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export {
  sellerProduct,
  sellerCategory,
  sellerSubCategory,
  nestedSubCategory,
  getAllCategory,
  getSubCategory,
  getNestedCategory
}
