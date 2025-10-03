const { sendSMS,sendSMS2 } = require("../services/opt.service");
const connectDb = require("../db/db");
const redis = require("../db/radis");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
async function sendOtp(req, res) {
  const db = await connectDb();
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number required" });
  }

  const [userRow] = await db.query("SELECT * FROM user WHERE phone = ?", [
    phone,
  ]);
  // console.log(`OTP for ${phone}: ${otp}`);

  if (userRow.length === 0) {
    // User not registered → redirect to register
    return res
      .status(404)
      .json({ message: "User not found", redirectToRegister: true });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const message = `${otp} is your Login OTP. Do not share it with anyone Regards MOJIJA.`;
  const formattedPhone = phone.startsWith("+91") ? phone : "+91" + phone;
  const ttl = 300;
  console.log("OTP stored in Redis:", otp, "for phone:", formattedPhone);

  // OTP cooldown: prevent resending before previous expires
  const lastRequest = await redis.get(`otp_request_time:${formattedPhone}`);

  if (lastRequest) {
    return res.status(429).json({
      message: "OTP already sent. Please wait before requesting again.",
    });
  }
  // Generate OTP and store atomically
  await redis
    .multi()
    .set(`otp:${formattedPhone}`, otp, "EX", ttl)
    .set(`otp_request_time:${formattedPhone}`, Date.now(), "EX", 60)
    .exec();

  try {
    await sendSMS(formattedPhone, message);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
  // TODO: Save OTP and expiry in DB if you want to verify later
}

async function verifyOtp(req, res) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

    const formattedPhone = phone.startsWith("+91") ? phone : "+91" + phone;
    const storedOtp = await redis.get(`otp:${formattedPhone}`);
    console.log("Stored OTP from Redis:", storedOtp);

    if (!storedOtp)
      return res.status(400).json({ message: "OTP expired or invalid" });

    if (storedOtp !== otp.toString()) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const db = await connectDb();
    const [userRow] = await db.query(
      "SELECT id, username, email, phone FROM user WHERE phone = ?",
      [phone]
    );

    const user = userRow[0];

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true });

    await redis.del(`otp:${phone}`);

    res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    console.log("error in veruify otp", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

async function verifyForgotOtp(req, res) {
  const { phone, otp } = req.body;
  console.log(phone,otp);
  
  try {
    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

    const storedOtp = await redis.get(`forgot_pass_otp:${phone}`);
    if (!storedOtp) return res.status(400).json({ message: "OTP expired or invalid" });
    if (storedOtp !== otp.toString()) return res.status(401).json({ message: "Invalid OTP" });

    // OTP valid → create a reset token (short-lived)
    const resetToken = uuidv4();
    await redis.set(`forgot_pass_token:${phone}`, resetToken, "EX", 600); // 10 min
    await redis.del(`forgot_pass_otp:${phone}`); // delete OTP after verification

    res.status(200).json({ message: "OTP verified", resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  sendOtp,
  verifyOtp,
  verifyForgotOtp
};
