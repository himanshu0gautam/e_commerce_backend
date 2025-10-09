const connectDb = require("../db/db"); // your DB connection


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