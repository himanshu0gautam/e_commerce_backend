const connectDb = require("../db/db"); // your DB connection
<<<<<<< HEAD

=======
const {sendEmailToApproved,sendEmailToRejected} = require('../services/sendEmail.service')
>>>>>>> 9626cc7c1824c10d0a7adcfd824fdf86643cb558

async function adminRegisterController(req, res) {
    try {

        const db = await connectDb();
        const { name, email, password } = req.body;

        const [exists] = await db.query("SELECT id FROM admin WHERE email = ?", [email]);

        if (exists.length > 0) {
            return res.status(400).json({ message: "Admin already registered" });
        }

        await db.query("INSERT INTO admin (name, email, password) VALUES (?, ?, ?)", [
            name,
            email,
            password,
        ]);

        res.status(201).json({ message: "Admin registered successfully" });

    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function adminLoginController(req, res) {

    const db = await connectDb();
    const { email, password } = req.body;

    try {

        const [admin] = await db.query("SELECT * FROM admin WHERE email = ? AND password = ?", [email,password]);
        if (admin.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin login successful", admin: admin[0] });

    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

<<<<<<< HEAD
async function getAllseller(req, res) {
    try {
        const db = await connectDb()

        const [seller] = await db.query('SELECT id FROM seller WHERE id = ?', [req.seller.id])
        if (seller.length === 0) return res.status(404).json({ message: "seller not found" });
        res.status(200).json({ seller: seller[0] });
=======
async function getSingleSeller(req, res) {
    try {
        const {sellerId } = req.params
        const db = await connectDb()
        const [seller] = await db.query('SELECT * FROM seller WHERE id = ?', [sellerId])
        if (seller.length === 0) return res.status(404).json({ message: "seller not found" });
        res.status(200).json({seller });
>>>>>>> 9626cc7c1824c10d0a7adcfd824fdf86643cb558
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function approveSeller(req, res) {
    const db = await connectDb();
    const { sellerId } = req.params;
    try {
<<<<<<< HEAD
        const [sellerRows] = await db.query("SELECT id FROM seller WHERE id = ?", [sellerId]);
        if (sellerRows.length === 0) {
            return res.status(404).json({ message: "Seller not found" });
        }
        await db.query("UPDATE seller SET approval_status = 'approved' WHERE id = ?", [sellerId]);

=======
        const [sellerRows] = await db.query("SELECT id,owner_email,company_name FROM seller WHERE id = ?", [sellerId]);
        if (sellerRows.length === 0) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const {owner_email,company_name} = sellerRows[0]

        await db.query("UPDATE seller SET approval_status = 'approved' WHERE id = ?", [sellerId]);

        await db.query("UPDATE admin SET approvedSellerCount = approvedSellerCount + 1 ")

        await sendEmailToApproved(owner_email,company_name)

>>>>>>> 9626cc7c1824c10d0a7adcfd824fdf86643cb558
        const [updatedSeller] = await db.query("SELECT * FROM seller WHERE id = ?", [sellerId]);
        res.status(200).json({ message: "Seller approved successfully",seller: updatedSeller[0] });
    } catch (error) {
        console.error("Error approving seller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function rejectSeller(req, res) {
<<<<<<< HEAD
    const db = await connectDb();
    const { sellerId } = req.params;
    try {
         const [sellerRows] = await db.query("SELECT id FROM seller WHERE id = ?", [sellerId]);
        if (sellerRows.length === 0) {
            return res.status(404).json({ message: "Seller not found" });
        }
        await db.query("UPDATE seller SET status = 'rejected' WHERE id = ?", [sellerId]);
=======
     let rejectedSellerCount = 0;
    const db = await connectDb();
    const { sellerId } = req.params;
    try {
         const [sellerRows] = await db.query("SELECT id, owner_email,company_name FROM seller WHERE id = ?", [sellerId]);
        if (sellerRows.length === 0) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const {owner_email,company_name} = sellerRows[0]

        await db.query("UPDATE seller SET approval_status = 'rejected' WHERE id = ?", [sellerId]);

        await db.query("UPDATE admin SET rejectedSellerCount = rejectedSellerCount + 1 ")

        sendEmailToRejected(owner_email,company_name)

>>>>>>> 9626cc7c1824c10d0a7adcfd824fdf86643cb558
        const [updatedSeller] = await db.query("SELECT * FROM seller WHERE id = ?", [sellerId]);
        res.status(200).json({ message: "Seller rejected successfully",seller: updatedSeller[0] });
    } catch (error) {
        console.error("Error rejecting seller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

<<<<<<< HEAD
module.exports = {
    adminRegisterController,
    adminLoginController,
    getAllseller,
    approveSeller,
    rejectSeller
=======
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

async function getApprovedAndRejectCount(req, res) {
  try {
    const db = await connectDb();

    // 👇 Call your stored procedure
    const [rows] = await db.query("CALL GetSellerStatusCount()");

    // ⚡ Procedure ka result ek nested array me aata hai (rows[0])
    const counts = rows[0][0]; 

    res.status(200).json({
      success: true,
      approved: counts.ApprovedSellers,
      rejected: counts.RejectedSellers
    });

  } catch (error) {
    console.error("❌ Error fetching seller count:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}


module.exports = {
    adminRegisterController,
    adminLoginController,
    getSingleSeller,
    approveSeller,
    rejectSeller,
    getallsellers,
    getApprovedAndRejectCount
>>>>>>> 9626cc7c1824c10d0a7adcfd824fdf86643cb558
}