const connectDb = require("../db/db"); // your DB connection
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require('../db/radis')
const {sendSMS2} = require('../services/opt.service')
async function registerController(req, res) {
  const db = await connectDb();
  const { username, email, password, phone } = req.body;

  if (!email || !username || !password || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const [rows] = await db.query("CALL registerUser(?, ?, ?, ?)", [
      email,
      username,
      hashPassword,
      phone,
    ]);

    const insertedUser = rows[0][0];

    if (insertedUser.status === -1) {
      return res.status(500).json({  message: insertedUser.message});
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, secure: true });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: insertedUser.user_id,
        username: insertedUser.username,
        email: insertedUser.email,
        phone: insertedUser.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginController(req, res) {
  const { phone, password } = req.body;

  if (!phone) return res.status(400).json({ message: "Phone is required" });

  const db = await connectDb();
  const [userRow] = await db.query("SELECT * FROM user WHERE phone = ?", [phone]);
  if (userRow.length === 0) return res.status(404).json({ message: "User not found" , redirectToRegister: true });

  const user = userRow[0];

  // 1️⃣ Password login
  if (password) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: true });
    return res.status(200).json({ message: "Login successful", user });
  }

}

async function logout(req,res) {
    try {
        const token = req.cookies.token

  if(token){
    await redis.set(`blacklist:${token}`,`true`,`EX`,24*60*60);
  }

  res.clearCookie('token',{
    httpOnly:true,
    secure:true
  })

  return res.status(200).json({message:"User logged out successfully"})
    } catch (error) {
        console.log("internal serfver error in logout ",error);
        res.status(500).json({message:"internal server"})
    }
}


async function forgotPassword(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const db = await connectDb();
    const [userRow] = await db.query("SELECT * FROM user WHERE phone = ?", [phone]);
    if (userRow.length === 0) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = 300; // 5 mins

    await redis.set(`forgot_pass_otp:${phone}`, otp, "EX", ttl);
    await sendSMS2(phone,   `${otp} is your password reset OTP. Do not share it with anyone Regards MOJIJA`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


async function resetPassword(req, res) {
  try {
    const { phone, newPassword } = req.body;
    if (!phone || !newPassword)
      return res.status(400).json({ message: "Phone, token and new password are required" });

    const storedToken = await redis.get(`forgot_pass_token:${phone}`);
    if (!storedToken) return res.status(400).json({ message: "Token expired or invalid" });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const db = await connectDb();
    await db.query("UPDATE user SET password = ? WHERE phone = ?", [hashedPassword, phone]);

    await redis.del(`forgot_pass_token:${phone}`); // remove token after successful reset

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}




module.exports = { registerController, loginController,logout,forgotPassword,resetPassword };
