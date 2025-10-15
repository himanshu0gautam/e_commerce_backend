const { sendSMS,sendSMS2 } = require("../services/opt.service");
const connectDb = require("../db/db");
const redis = require("../db/radis");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const radis = require("../db/radis");
const sendEmail= require('../services/sendEmail.service')

async function sellerRegisterSendOTP(req,res) {
  const db =await connectDb()
  const {phone} = req.body

  if(!phone){
    return res.status(400).json({message:"Phone is required"})
  }

  const [IsSellerExist] = await db.query('SELECT * FROM seller WHERE phone = ?',[phone])

  if(IsSellerExist.length > 0){
    return res.status(404).json({message:"Seller is already register"})
  }

  const otp = Math.floor(10000 + Math.random() * 90000).toString()
  console.log(otp);
  
  const message = `${otp} is your Login OTP. Do not share it with anyone Regards MOJIJA.`;
  const formattedPhone = phone.startsWith('+91') ? phone : "+91"+phone;
  const ttl = 300

  console.log("OTP stored in Redis:", otp, "for phone:", formattedPhone);

  const lastRequest = await redis.get(`otp_request_time:${formattedPhone}`);

  if (lastRequest) {
    return res.status(409).json({
      message: "OTP already sent. Please wait before requesting again.",
    });
  }

  await radis
    .multi()
    .set(`otp:${formattedPhone}`,otp,'EX',ttl)
    .set(`otp_request_time:${formattedPhone}`,Date.now(),'EX',60)
    .exec()

    try {
      await sendSMS(formattedPhone,message)
      res.status(200).json({message:"OTP send Successfuly"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to send OTP" });
    }
}

async function sellerRegisterVerifyOTP(req,res) {
  const db =await connectDb()
  const {phone , otp} = req.body

  if(!phone || !otp){
    return res.status(400).json({message:"Phone and OTP is required"})
  }

  const [isPhoneExist] = await db.query(`SELECT * FROM seller WHERE phone = ?`,[phone])

  if(isPhoneExist >0){
    return res.status(401).json({message:"This phone is already register"})
  }

  const formattedPhone = phone.startsWith("+91") ? phone : "+91"+phone;
  const storedOTP = await radis.get(`otp:${formattedPhone}`)

  if(!storedOTP){
    return res.status(400).json({message:"OTP is expired or invalid"})
  }

  if(storedOTP !== otp.toString()){
    return res.status(401).json({message:"Invalid OTP"})
  }

  await redis.del(`otp:${formattedPhone}`);
  res.status(201).json({message:"Phone Number verified succesfully",verifyPhone:true})

}

async function sellerRegisterSendEmailOTP(req,res) {
  try {
    const {email} = req.body

    if(!email){
      return res.status(400).json({message:"email is required"})
    }

    const lastRequest = await radis.get(`otp_request_time:${email}`)

    if (lastRequest) {
    return res.status(409).json({
      message: "OTP already sent. Please wait before requesting again.",
    });
  }

  const otp = Math.floor(10000 + Math.random() * 90000).toString()
    const key = `email_otp:${email}`;
    const ttl = 300


  await radis
  .multi()
  .set(key,otp,"EX",ttl)
  .set(`otp_request_time:${email}`,Date.now(),"EX",60)
  .exec()
   await sendEmail(email,"Your OTP for Seller Verification",otp)

   res.status(200).json({message:"OTP sent successfult to your email"})

  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
}

async function sellerRegisterVerifyEmailOTP(req,res) {
  const {email,otp} = req.body

  if(!email || !otp){
    return res.status(400).json({message:"email and otp is required"})
  }

  try {
    const storedOtp = await radis.get(`email_otp:${email}`)

  if(!storedOtp){
    return res.status(401).json({message:"OTP is expired"})
  }

  if(storedOtp !== otp.toString()){
    return res.status(409).json({message:"Invalid OTP"})
  }

  await radis.del(`email_otp:${email}`)
  res.status(201).json({message:"OTP verify Succesfully for Register Seller",verifyEmail:true})

  } catch (error) {
    console.log("can not verify otp",error);
    res.status(500).json({message:"Failed to verify OTP"})
  }
}

async function sellerSendOtp(req, res) {
  const db = await connectDb();
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number required" });
  }

   if(seller.approval_status ==="pending"){
      return res.status(409).json({message:"till now u are not approved to login"})
    }

    if(seller.approval_status ==="rejected"){
      return res.status(409).json({message:"you are rejected by admin"})
    }

  const [userRow] = await db.query("SELECT * FROM seller WHERE phone = ?", [
    phone,
  ]);
  // console.log(`OTP for ${phone}: ${otp}`);

  if (userRow.length === 0) {
    // User not registered → redirect to register
    return res
      .status(404)
      .json({ message: "Seller not found", redirectToRegister: true });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const message = `${otp} is your Login OTP. Do not share it with anyone Regards MOJIJA.`;
  const formattedPhone = phone.startsWith("+91") ? phone : "+91" + phone;
  const ttl = 300;
  console.log("OTP stored in Redis:", otp, "for phone:", formattedPhone);

  // OTP cooldown: prevent resending before previous expires
  const lastRequest = await redis.get(`otp_request_time:${formattedPhone}`);

  if (lastRequest) {
    return res.status(409).json({
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

async function sellerVerifyOtp(req, res) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

     if(seller.approval_status ==="pending"){
      return res.status(409).json({message:"till now u are not approved to login"})
    }

    if(seller.approval_status ==="rejected"){
      return res.status(409).json({message:"you are rejected by admin"})
    }

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
      "SELECT phone,email,fullname FROM seller WHERE phone = ?",
      [phone]
    );

    const seller = userRow[0];

    const token = jwt.sign(
      { id: seller.id, phone: seller.phone },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // res.cookie("token", token, { httpOnly: true, secure: true });
res.cookie("sellertoken", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
});

    await redis.del(`otp:${phone}`);

    res.status(200).json({ message: "Login successful", seller });

  } catch (error) {
    console.log("error in veruify otp", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

async function sellerVerifyForgotOtp(req, res) {
  const { phone, otp } = req.body;
  console.log(phone,otp);
  
  try {
    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

     if(seller.approval_status ==="pending"){
      return res.status(409).json({message:"till now u are not approved to login"})
    }

    if(seller.approval_status ==="rejected"){
      return res.status(409).json({message:"you are rejected by admin"})
    }

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
    sellerSendOtp,
    sellerVerifyOtp,
    sellerVerifyForgotOtp,
    sellerRegisterSendOTP,
    sellerRegisterVerifyOTP,
    sellerRegisterSendEmailOTP,
    sellerRegisterVerifyEmailOTP
}