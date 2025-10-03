const connectDb = require('../db/db'); // your DB connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerController(req, res) {
    const db = await connectDb();
    const { username , email, password, phone } = req.body;

    if (!email || !username || !password || !phone) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const [existingUsers] = await (await db).query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const insertQuery = '';

        const [rows] = await (await db).query(
            insertQuery,
            [email, name, hashPassword, role || "user", street, city, state, zip, country]
        );

        const insertedUser = rows[0][0]

        if (!insertedUser) {
            return res.status(500).json({ message: "Failed to insert user" });
        }

        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie('token', token, { httpOnly: true ,secure:true});

        res.status(201).json({ 
            message: "User registered successfully",
            user:insertedUser
         });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function loginController(req,res) {
   try {
     const db = await connectDb();
    const {name,email,password} = req.body

    if (!name && !email) {
      return res.status(400).json({ message: "Username or email is required" });
    }

    const [row] =  await db.execute(
        'SELECT * FROM USERS WHERE name = ? OR email = ?',
        [name || null ,email || null]
    )

    if(row.length===0){
        return res.status(404).json({message:"User not found"})
    }

    const user = row[0]

    const isPassswordVAlid = bcrypt.compare(password,user.password)

    if(!isPassswordVAlid){
        return res.status(401).json({message:"Invalid password"})
    }

    res.status(201).json({
        message:"user lopgedin successfully",
        user:{
            id:user.id,
            username:user.username,
            email:user.email      
        }
    })
   } catch (err) {
    console.error(err);
     res.status(500).json({ message: "Server error" });
  }

}

module.exports = { registerController,loginController };
