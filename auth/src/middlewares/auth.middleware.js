const jwt = require('jsonwebtoken');
const connectDb = require('../db/db');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1] ;
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await connectDb();

    // Fetch user from DB
    const [rows] = await db.query('SELECT id, username, email, phone FROM user WHERE id = ?', [decoded.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    req.user = rows[0]; // attach user to request
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

const sellerAuthMiddleware = async (req, res, next) => {
  try {

    const token = req.cookies?.sellertoken || req.headers?.authorization?.split(' ')[1];

    console.log(token);
    

    console.log("Token:", token);

    if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await connectDb();

    const [rows] = await db.query('SELECT * FROM seller WHERE id = ?', [decoded.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Seller not found' });

    req.seller = rows[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = {authMiddleware,sellerAuthMiddleware};
