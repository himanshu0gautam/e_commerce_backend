const {sendSMS,sendSMS2} = require('../services/opt.service')

async function sendOtpController(req,res) {
    const {phone} =  req.body

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const message =`${otp} is your Login OTP. Do not share it with anyone Regards MOJIJA.`

     if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // console.log(`OTP for ${phone}: ${otp}`);

    const formattedPhone = phone.startsWith("+91") ? phone : "+91" + phone;

    try {
    await sendSMS(formattedPhone, message);
    await sendSMS2(formattedPhone, message);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }

  // TODO: Save OTP and expiry in DB if you want to verify later


}

// export const Sendotp = async (req: Request, res: Response): Promise<void> => {


//   const Phone: string = req.body.Phone || req.body.phone;


//   if (!Phone) {
//     res.status(400).json({ success: false, message: "Phone number required" });
//     return;
//   }

//   const otp: string = Math.floor(100000 + Math.random() * 900000).toString();

//   await setOtp(Phone, otp);
//    await sendSMS(Phone, ${otp} is your Login OTP. Do not share it with anyone Regards MOJIJA.);
//   console.log(otp);
//   // console.log(OTP for ${phone}: ${otp});

//   res.json({ success: true, message: "OTP sent successfully" , } );
// }



module.exports = {
    sendOtpController
}