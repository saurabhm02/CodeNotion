const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/template/emailVerificationTemplate");
const { response } = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    },
    
});

const sendVerificationEmail = async(email, otp) => {
    try{ 
        console.log("email: ", email);
        console.log("otp: ", otp);
        const mailResponse = await mailSender(
            email, 
            "Verification Email from CodeNotion", 
            emailTemplate(otp)
        );

        console.log("response: ", mailResponse);
        console.log("Email sent  successfully!",  mailResponse); 
    }
    catch(err){
        console.log("error in sendVerificationEmail section: ",err);
        throw err;
    }
}

OTPSchema.pre("save", async function(next){
    console.log("New document saved to database");

    if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;