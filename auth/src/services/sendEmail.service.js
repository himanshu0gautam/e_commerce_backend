const nodemailer = require("nodemailer")
const Mail = require("nodemailer/lib/mailer")

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

async function sendEmail(to,subject,message) {
    try {
        const mailOption = {
            from:`"Seller Verification" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html:`<div style="font-family:sans-serif;">
              <h2>Seller OTP Verification</h2>
              <p>Your OTP is:</p>
              <h1 style="color:#2f54eb;">${message}</h1>
              <p>This OTP will expire in <b>5 minutes</b>.</p>
            </div>`
        }
        await transporter.sendMail(mailOption)
        console.log("Email send  to:", to);
    } catch (error) {
        console.error("❌ Email send error:", error);
        throw new Error("Email not sent");
    }
}

module.exports = sendEmail