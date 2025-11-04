import { pool } from "../db/db.js";

import connectDb from "../db/db.js";
import { uploadImage } from "../services/services.js";

async function sellerCategory(req, res) {

  try {

    // const { id: seller_id, fullname: seller_name } = req.seller;    

    const { category_name, description } = req.body;

    if (!category_name) {
      return res.status(401).json({ message: "Category name is requireddd" });
    }

    const allowedCategory = ['fashion', 'electronic', 'grosery', 'jewellery', 'book', 'other'];

    if (!allowedCategory.includes(category_name.toLowerCase())) {
      return res.status(401).json({ message: `Invalid category Choose one of: ${allowedCategory.join(', ')}` });
    }

    const [existingCategory] = await pool.query(
      'SELECT * FROM category WHERE category_name = ?',
      [category]
    );


    if (existingCategory.length > 0) {
      return res.status(202).json({
        message: `You already added the '${category_name}' category. Please use it or add a new category.`,
        existingCategory: existingCategory[0]
      });
    }

    // const [existingCount] = await pool.query(
    //   'SELECT COUNT(*) AS count FROM category WHERE id =?',
    //   [id]);


    // if (existingCount[0].count >= 4) {
    //   return res.status(400).json({ message: "You can only add up to 4 categories" });
    // }

    const [result] = await pool.query(
      `INSERT INTO category(category_name, description) VALUES (?, ?)`,
      [category_name, description]
    );

    const [newCategoryRows] = await pool.query(
      'SELECT * FROM category WHERE id = ?',
      [result.insertId]
    );

    res.status(200).json({
      message: "Category Add Successfull",
      sellerCategory: newCategoryRows[0],
      existingCategory: existingCategory
    });
  } catch (error) {
    console.error("Error creating seller Category:", error);
    res.status(500).json({ message: "Seller category creation failed" });
  }
}

async function sellerSubCategory(req, res) {

  try {

    const { sub_cat_name, description } = req.body;

    // const { id: seller_id } = req.seller;

    if (!sub_cat_name) {
      return res.status(401).json({ message: "sub-category name are required" })
    }

    const allowedCategory = ['men', 'women', 'kids', 'sports', 'footwear', 'watches', 'beauty', 'sunglasses']

    if (!allowedCategory.includes(sub_cat_name.toLowerCase())) {
      return res.status(401).json({
        message: `Invalid category choose one of: ${allowedCategory.join(', ')}`
      })
    }

    const [existingSubCat] = await pool.query(
      'SELECT * FROM sub_category WHERE sub_cat_name = ?', [sub_cat_name]
    )

    if (existingSubCat.length > 0) {
      return res.status(202).json({
        message: `you already added the '${sub_cat_name}' sub_category. please use it or add a new sub_category`,
        existingSubCategory: existingSubCat[0]
      })
    }

    // const [category] = await pool.query
    //   ("SELECT id, category_name FROM mojija_product.category WHERE seller_id = ? ORDER BY id DESC LIMIT 1", [seller_id]);

    // if (category.length === 0) {
    //   return res.status(404).json({ message: "Category not found for this seller" })
    // }

    // const category_id = category[0].id;
    // const category_name = category[0].category_name;

    const [result] = await pool.query
      (`INSERT INTO sub_category (sub_cat_name, description) VALUE (?, ?)`,
        [sub_cat_name, description]
      );

    const [newSubCategory] = await pool.query(
      `SELECT * FROM sub_category WHERE id = ?`,
      [result.insertId]);


    res.status(200).json({
      message: "Sub_Category Add successfull",
      sellerSubCategory: newSubCategory[0],
      existingCategory: existingSubCat
    })

  } catch (error) {
    console.error("Error creating seller Sub_Category:", error);
    res.status(500).json({ message: "Seller Sub_Category creation failed" });
  }

}

async function nestedSubCategory(req, res) {

  try {

    // const db = await connectDb();

    // const { id: seller_id } = req.seller;

    const { nested_sub_cat_name, description } = req.body;

    if (!nested_sub_cat_name) {
      return res.status(401).json({ message: "nested_sub_cat_name is required" })
    }

    const allowedCategory = ['All', 'shirt', 'tops', 'jeans', 'kurta', 'sarees', 't-shirt', 'polo', 'Trouser', 'sweater', 'jacket', 'suits & blazers', 'innerwear']

    if (!allowedCategory.includes(nested_sub_cat_name.toLowerCase())) {
      return res.status(401).json({
        message: `Invalid Nested_category choose one of: ${allowedCategory.join(', ')}`
      })
    }

    // const [sub_category] = await pool.query
    //   (`SELECT id, sub_cat_name FROM mojija_product.sub_category WHERE seller_id = ? ORDER BY id DESC LIMIT 1`, [seller_id])    //WHERE ka matlab condition lagana. Yaha sirf wahi rows chahiye jahan seller_id match ho.

    // if (sub_category.length === 0) {
    //   return res.status(404).json({ message: "sub_category is not found this seller" })
    // }

    // const sub_category_id = sub_category[0].id;
    // const subCategory = sub_category[0].sub_cat_name;

    const [existingNestedCategory] = await pool.query(
      'SELECT * FROM nested_sub_category WHERE nested_sub_cat_name = ?', [nested_sub_cat_name]
    );

    if (existingNestedCategory.length > 0) {
      return res.status(202).json({
        message: `You already added the '${nested_sub_cat_name}' category. please use it or add a new category.`,
        nestedSubCategory: existingNestedCategory[0]
      })
    }

    const [result] = await pool.query
      ('INSERT INTO nested_sub_category (nested_sub_cat_name, description) VALUE (?, ?)',
        [
          nested_sub_cat_name,
          description
        ]
      );

    const [nested_subCategory] = await pool.query
      (`SELECT * FROM mojija_product.nested_sub_category WHERE id =?`,
        [result.insertId]
      )

    res.status(200).json({
      message: "nested_sub_category create successfull",
      nested_sub_cat_name: nested_subCategory[0],
      NestedCategory: existingNestedCategory
    })

  } catch (error) {
    console.error("Error creating seller nested_Sub_Category:", error);
    res.status(500).json({ message: "Seller nested_Sub_Category creation failed" });
  }
}

async function sellerProduct(req, res) {
  try {

    // const db = await connectDb();

    const { id: seller_id } = req.seller;

    const { product_name,
      sku,
      brand,
      location_city,
      location_state,
      location_country,
      gst_verified,
      product_price,
      product_unit,
      description,
      product_date,
      color,
      size,
      product_Material,
      product_specification,
      category_name,
      sub_cat_name,
      nested_sub_cat_name
    } = req.body;

    const [category_id] = await pool.query
      ('SELECT id FROM mojija_product.category WHERE category_name = ?', [category_name])

    if (category_id.length === 0) {
      return res.status(404).json({ message: "Category not found for this seller" })
    }

    const category = category_id[0].id;

    const [subCategory_id] = await pool.query
      ('SELECT id FROM mojija_product.sub_category WHERE sub_cat_name = ?', [sub_cat_name])

    if (subCategory_id.length === 0) {
      return res.status(404).json({ message: "Sub_Category not found for this seller" })
    }

    const sub_category = subCategory_id[0].id

    const [NestedCategory_id] = await pool.query
      ('SELECT id FROM mojija_product.nested_sub_category WHERE nested_sub_cat_name = ?', [nested_sub_cat_name])

    if (NestedCategory_id.length === 0) {
      return res.status(404).json({ message: "nested_Category not found for this seller" })
    }

    const Nested_category = NestedCategory_id[0].id

    const [productCountResult] = await pool.query(
      'SELECT COUNT(product_id) AS product_count FROM product WHERE seller_id = ?', [seller_id]
    );

    const product_count = productCountResult[0].product_count;
    console.log("pp", product_count);

    // Insert product
    const [insertResult] = await pool.query
      (`INSERT INTO product (
        seller_id, 
        product_name, 
        category_id, 
        sku, 
        subcategory_id, 
        brand, 
        location_city, 
        location_state, 
        location_country, 
        gst_verified, 
        product_price, 
        product_unit, 
        description, 
        product_date, 
        nested_category_id, 
        color, 
        size, 
        product_Material, 
        product_specification) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          seller_id,
          product_name,
          category,
          sku,
          sub_category,
          brand,
          location_city,
          location_state,
          location_country,
          gst_verified,
          product_price,
          product_unit,
          description,
          product_date,
          Nested_category,
          color,
          size,
          product_Material,
          product_specification
        ]
      );

    // Fetch the inserted product
    const [newProductRows] = await pool.query(
      `SELECT * FROM product WHERE product_id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      message: "Product created successfully",
      sellerProduct: newProductRows[0],
      products_added_by_seller: product_count + 1,
    });
  } catch (error) {
    console.error("Error creating seller product:", error);
    res.status(500).json({ message: "Seller product creation failed" });
  }
}

async function sellerImage(req, res) {

  try {

    // const db = await connectDb();

    const { id: seller_id } = req.seller;

    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload all images
    const uploadedFiles = await Promise.all(files.map(file => uploadImage(file)));
    const url = uploadedFiles.map(f => f.optimized_url);

    const [productIdResult] = await pool.query(
      "SELECT product_id FROM mojija_product.product WHERE seller_id = ? ORDER BY product_id DESC LIMIT 1", [seller_id]
    )

    if (productIdResult.length === 0) {
      return res.status(404).json({ message: "Product not found for this seller" })
    }

    // query selected `product_id` column; use that property
    const product_id = productIdResult[0].product_id;
    console.log(product_id);

    const [result] = await pool.query
      (`INSERT INTO mojija_product.product_url (product_id, seller_id, url) VALUES(?, ?, ?)`,
        [
          product_id,
          seller_id,
          JSON.stringify(url),
        ]
      );

    const [rows] = await pool.query
      ("SELECT * FROM product_url WHERE image_id = ?",
        [result.insertId]
      )

    res.status(201).json({
      message: "Product_url created successfully",
      sellerProduct: rows[0]
    });

  } catch (error) {
    console.error("Error creating seller image_url:", error);
    res.status(500).json({ message: "Seller image_url creation failed" });
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

async function getAllProduct(req, res) {
  const db = await connectDb();

  const { id: seller_id } = req.seller

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // check konsa seller login hai 
    const sellerId = req.seller?.id

    let rowsQuery = 'SELECT * FROM mojija_product.product';
    let countQuery = 'SELECT COUNT (*) as total FROM mojija_product.product';

    const params = [];
    const countParams = [];

    // agar sellerId hai to query ko filter kar do
    if (sellerId) {
      rowsQuery += " WHERE seller_id = ?";
      countQuery += " WHERE seller_id = ?";
      params.push(sellerId);
      countParams.push(sellerId);
    }


    // add pagination placeholders
    rowsQuery += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [productCountResult] = await pool.query(
      'SELECT COUNT(product_id) AS product_count FROM product WHERE seller_id = ?', [seller_id]
    );

    const product_count = productCountResult[0].product_count;
    console.log(product_count);

    const [rows] = await db.query(rowsQuery, params)

    // total count (for total pages) — agar seller filter laga tha toh same filter use karo
    const [totalResult] = await db.query(countQuery, countParams);
    const total = totalResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // agar koi product nahi mila
    if (rows.length === 0) {
      const msg = sellerId
        ? "No products found for this seller"
        : "Product not found";
      return res.status(404).json({ message: msg });
    }

    res.status(201).json({
      currentPage: page,
      totalPages,
      totalRecords: total,
      data: rows,
      TotalProduct: product_count
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getImageUrl(req, res) {

  try {
    const db = await connectDb()

    const [results] = await db.query('CALL GetProductDetailsWithImages()');

    const productList = results[0];

    if (productList.length === 0) {
      return res.status(200).json({ message: "No products found.", data: [] });
    }

    const processedProducts = productList.map(product => {
      // Check if the aggregated image_urls array is present
      if (product.image_urls) {
        try {
          // product.image_urls is a JSON string containing an array of URL strings.
          // Example: '[ "url1", "url2" ]'
          product.image_urls = product.image_urls;
        } catch (e) {
          console.error("Error parsing image_urls JSON for product:", product.product_id, e);
          product.image_urls = [];
        }
      } else {
        product.image_urls = [];
      }

      return product;
    });

    // 3. Send the entire list to the frontend
    res.status(200).json({
      success: true,
      count: processedProducts.length,
      data: processedProducts
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "getImgUrl Internal server error" });
  }
}


export {
  sellerProduct,
  sellerCategory,
  sellerSubCategory,
  nestedSubCategory,
  getAllCategory,
  getSubCategory,
  getNestedCategory,
  getAllProduct,
  sellerImage,
  getImageUrl
}
