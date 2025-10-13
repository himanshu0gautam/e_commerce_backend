const connectDb = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { sendSMS, sendSMS2 } = require("../services/opt.service");
const redis = require("../db/radis");


async function sellerRegistration(req, res) {
  console.log("hello seller");
  const db = await connectDb();
  const {
    phone,
    email,
    fullname,
    password,
    gst_no,
    organisation_email,
    primary_contact_person_name,
    primary_contact_person_phone,
    primary_contact_person_email,
    business_owner_name,
    business_owner_phone,
    business_owner_email,
    company_name,
    warehouse_pincode,
    warehouse_state,
    warehouse_full_address,
    warehouse_order_procising_capacity,
    bank_account_holder_name,
    bank_account_no,
    bank_IFCS,
    bank_name,
    account_type,
    nature_of_business,
    business_category,
    declaration,
  } = req.body;

  try {

    const [exists] = await db.query(
      "SELECT id FROM seller WHERE email = ? AND phone = ?",
      [email, phone]
    );

    if (exists.length > 0) {
      return res.status(401).json({
        message: "Email or phone already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "CALL RegisterSeller(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        phone,
        email,
        fullname,
        hashedPassword,
        gst_no,
        organisation_email,
        primary_contact_person_name,
        primary_contact_person_phone,
        primary_contact_person_email,
        business_owner_name,
        business_owner_phone,
        business_owner_email,
        company_name,
        warehouse_pincode,
        warehouse_state,
        warehouse_full_address,
        warehouse_order_procising_capacity,
        bank_account_holder_name,
        bank_account_no,
        bank_IFCS,
        bank_name,
        account_type,
        nature_of_business,
        business_category,
        declaration,
      ]
    );

    const insertedSeller = result[0] ? result[0][0] : null;

    const token = jwt.sign({
      id: insertedSeller.id,
      email: insertedSeller.email,
      fullname: insertedSeller.fullname,
      phone: insertedSeller.phone
    }, process.env.JWT_SECRET)

    // res.cookie('selertoken',token,{ httpOnly: true, secure: true })
res.cookie("sellertoken", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
});

    res.status(201).json({
      message: "Seller registered, pending admin approval",
      sellerId: result.insertId,
      seller: insertedSeller
    });
  } catch (error) {
    console.error("Error registering seller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function sellerLogin(req, res) {
  const { phone, password } = req.body

  if (!phone) {
    res.status(400).json({ message: "Phone number is required" })
  }

  try {
    const db = await connectDb()

      const [sellerRows] = await db.query(
        "SELECT id, phone, approval_status, email, fullname,password FROM seller WHERE phone = ?",
        [phone]
      );
    if (sellerRows.length === 0) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const seller = sellerRows[0];  



    if(seller.approval_status ==="pending"){
      return res.status(409).json({message:"till now u are not approved to login"})
    }

    if(seller.approval_status ==="rejected"){
      return res.status(409).json({message:"you are rejected by admin"})
    }

    if (password) {
      const isMatch = await bcrypt.compare(password, seller.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    const token = jwt.sign({
      id: seller.id,
      email: seller.email,
      fullname: seller.fullname,
      phone: seller.phone
    }, process.env.JWT_SECRET)

    res.cookie('sellertoken',token,{ httpOnly: true, secure: false ,sameSite: 'lax', })

    res.status(201).json({
      message: "Seller login successfully",
      seller: {
        seller:seller.id,
        phone:seller.phone,
        email:seller.email,
        fullname:seller.fullname,
        seller_status:seller.approval_status
      }
    });

  } catch (error) {
    console.error("Error logging in seller:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

async function sellerForgotPassword(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

     if(seller.approval_status ==="pending"){
      return res.status(409).json({message:"till now u are not approved to login"})
    }

    if(seller.approval_status ==="rejected"){
      return res.status(409).json({message:"you are rejected by admin"})
    }

    const db = await connectDb();
    const [userRow] = await db.query("SELECT * FROM seller WHERE phone = ?", [phone]);
    if (userRow.length === 0) return res.status(404).json({ message: "seller not found" });

     if(seller.approval_status ==="pending"){
      return res.status(409).json({message:"till now u are not approved to login"})
    }

    if(seller.approval_status ==="rejected"){
      return res.status(409).json({message:"you are rejected by admin"})
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = 300; // 5 mins

    await redis.set(`forgot_pass_otp:${phone}`, otp, "EX", ttl);
    await sendSMS2(phone, `${otp} is your password reset OTP. Do not share it with anyone Regards MOJIJA`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function sellerResetPassword(req, res) {
  try {
    const { phone, newPassword } = req.body;
    if (!phone || !newPassword)
      return res.status(400).json({ message: "Phone, token and new password are required" });

     if(seller.approval_status ==="pending"){
      return res.status(409).json({message:"till now u are not approved to login"})
    }

    if(seller.approval_status ==="rejected"){
      return res.status(409).json({message:"you are rejected by admin"})
    }

    const storedToken = await redis.get(`forgot_pass_token:${phone}`);
    if (!storedToken) return res.status(400).json({ message: "Token expired or invalid" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const db = await connectDb();
    await db.query("UPDATE seller SET password = ? WHERE phone = ?", [hashedPassword, phone]);

    await redis.del(`forgot_pass_token:${phone}`); // remove token after successful reset

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getsellerData(req, res) {
  try {
    const db = await connectDb()

    const [seller] = await db.query('CALL GetSellerData(?)', [req.seller.id])
    if (seller.length === 0) return res.status(404).json({ message: "seller not found" });
    res.status(200).json({ seller: seller[0] });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getallsellers(req,res) {
  
  try {
    const db =await connectDb()

     const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 10; // default limit = 10
    const offset = (page - 1) * limit;

    const [allSellerData] = await db.query(`SELECT * FROM seller LIMIT ? OFFSET ?`,
      [limit, offset])

    if(allSellerData.length === 0){
      return res.status(404).json({message:"No sellers found"})
    }

    res.status(201).json({
      message:"All seller data fetched successfully",
      page,
      limit,
      allSellerData:allSellerData
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  sellerRegistration,
  sellerLogin,
  sellerForgotPassword,
  sellerResetPassword,
  getsellerData,
  getallsellers
};
