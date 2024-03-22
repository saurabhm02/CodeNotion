const User = require("../models/User.model");
const OTP = require("../models/OTP.model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile.model");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdateTemplate } = require("../mail/template/passwordUpdateTemplate");
require("dotenv").config();

const jwt_Secret = process.env.JWT_SECRET;

exports.sendOTP = async (req, res) => {

  try {
    const { email } = req.body; // fetching email from rewquest body

    const checkUserPresent = await User.findOne({ email }); // check iof user is already exist

    // if user already exist, then return a response
    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User is already exit!",
      });
    };


    // generating an otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Otp generated: ", otp);

    // check otp  for its uniqueness
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    // creatinfg entry in db
    const otpBody = OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
      otp,
    });

  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Signup controller
exports.signUp = async (req, res) => {
  try {
    // data fetching from request body
    const { firstName,
      lastName,
      email,
      password,
      cPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate imp details
    if (!firstName || !lastName || !email || !password || !cPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required "
      });
    }

    // checking password and confirm poassword is matching or nott
    if (password !== cPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm password does not match, please match the password",
      })
    };

    // check user is already exist or not in db
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please use a different email address."
      });
    };

    // finsding most recent OTP storted for athe user
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    console.log(recentOtp);
    // validating otp
    if (recentOtp.length === 0) {
      // OTP not found    
      return res.status(400).json({
        success: false,
        message: "OTP not found for this email address. Please request a new OTP.",
      });
    }

    else if (otp !== recentOtp.otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please enter the correct OTP.",
      });
    };

    // hashing the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);
    
    // creating entrey ion db
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      aditonalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    res.status(200).json({
      success: true,
      message: "User registered succcessfully",
      user,
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User cannot be registered!, Please try again",
    });
  }
}


// login logic

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All required fields must be provided. Please make sure you've filled out all mandatory fields correctly.",
      });
    }

    // checking user is exist or not in db
    const user = await User.findOne({ email }).populate("aditonalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please ensure you've registered yourself!.",
      });
    }

    // after matching password , generate JWt

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      }
      const token = jwt.sign(payload, jwt_Secret, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
        user,
      })

    }
    else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect!",
      })
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot login!, Please try again",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
  
    const { oldPassword, newPassword, cPassword } = req.body;
    const userDetails = await User.findById(req.user.id);
    // validating the daeatails
    if( !oldPassword || !newPassword || !cPassword) {
      return res.status(403).json({
        success: false,
        message: "All required fields must be provided. Please make sure you've filled out all mandatory fields correctly.",
      });
    }

    if(newPassword !== cPassword){
      return res.status(400).json({
        success: false,
        message: "password and confirm password does not match, please match the password",
      })
    }

    // retriving the data of user from DB


    if(!userDetails) {
      return res.status(401).json({
        success: false,
        message: "userDetails not found. Please ensure you've registered yourself!.",
      });
    }

    // now verifyiang the old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password); 
    if(!isPasswordMatch){
        return res.status(401).json({
          success: false,
          message: "old password is incorrect!",
        });
    }

    // updating password of user
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashPassword },
      { new: true }
    );

    //now after thsi just send the email of password changed
    try{
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for yout account has been Changed",
        passwordUpdateTemplate(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email send success", emailResponse.response);
    }
    catch(error){
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: error.message || "Error occurred while sending email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    })
  }
  catch(error){
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to change password. Please try again later.",
    });
  }
};
