import jwt from "jsonwebtoken"
import connectDb from "../db/db.js";

async function verifySellerProduct(req, res, next) {

    try {
        
        const token = req.cookies?.sellertoken || req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const db = await connectDb();

<<<<<<< HEAD
        const [rows] = await db.query('SELECT id,fullname, email FROM `mojija-auth`.seller WHERE id = ?', [decoded.id]);
=======
        const [rows] = await db.query('SELECT id, email, fullname FROM `mojija-auth`.seller WHERE id = ?', [decoded.id]);
>>>>>>> product
        if (rows.length === 0) return res.status(404).json({ message: 'Seller not found' });

        console.log("Decoded:", decoded);
        console.log("Seller from DB:", rows[0]);

        req.seller = rows[0];
        next()

    } catch (error) {

        console.error(error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });

    }
}


export { verifySellerProduct }