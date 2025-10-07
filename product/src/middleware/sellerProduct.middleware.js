import jwt from "jsonwebtoken"
import connectDb from "../db/db.js";

async function verifySellerProduct(req, res, next) {

    try {

        const token = req.cookie?.token || req.headers?.authorization?.split('')[1];

        console.log(token);
        

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const db = await connectDb();

        const [rows] = await db.query('SELECT id, email FROM seller WHERE id = ?', [decoded.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        req.seller = rows[0];
        next()

    } catch (error) {

        console.error(error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });

    }
}


export { verifySellerProduct }