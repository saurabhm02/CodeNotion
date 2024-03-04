const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60,
    },
    otp: {
        type: Number,
        required: true,
    }
});

const sendVerificationEmail = async(email, otp) => {
    try{ 
        const mailResponse = await mailSender(email, "Verification Email from CodeNotion", otp);
        console.log("Email sent  successfully!", mailResponse); 
    }
    catch(err){
        console.log("error in sendVerificationEmail section: ",err);
        throw err;
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);