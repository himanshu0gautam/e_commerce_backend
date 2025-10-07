const connectDb = require("../db/db"); // your DB connection
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');


async function adminRegisterController(req, res) {
    try {

        const db = await connectDb();
        const { name, email, password } = req.body;

        const [exists] = await db.query("SELECT id FROM admin WHERE email = ?", [email]);

        if (exists.length > 0) {
            return res.status(400).json({ message: "Admin already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query("INSERT INTO admin (name, email, password) VALUES (?, ?, ?)", [
            name,
            email,
            hashedPassword,
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

        const [admin] = await db.query("SELECT * FROM admin WHERE email = ?", [email]);
        if (admin.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const valid = await bcrypt.compare(password, admin[0].password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin[0].id, email: admin[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("admintoken", token, { httpOnly: true, secure: true });
        res.status(200).json({ message: "Admin login successful", admin: admin[0] });

    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

async function getAllseller(req, res) {
    try {
        const db = await connectDb()

        const [seller] = await db.query('SELECT id FROM seller WHERE id = ?', [req.seller.id])
        if (seller.length === 0) return res.status(404).json({ message: "seller not found" });
        res.status(200).json({ seller: seller[0] });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function approveSeller(req, res) {
    const db = await connectDb();
    const { sellerId } = req.params;

    try {
        await db.query("UPDATE seller SET status = 'approved' WHERE id = ?", [sellerId]);
        res.status(200).json({ message: "Seller approved successfully" });
    } catch (error) {
        console.error("Error approving seller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function rejectSeller(req, res) {
    const db = await connectDb();
    const { sellerId } = req.params;

    try {
        await db.query("UPDATE seller SET status = 'rejected' WHERE id = ?", [sellerId]);
        res.status(200).json({ message: "Seller rejected successfully" });
    } catch (error) {
        console.error("Error rejecting seller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    adminRegisterController,
    adminLoginController,
    getAllseller,
    approveSeller,
    rejectSeller
}