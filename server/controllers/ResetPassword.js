const { hasUncaughtExceptionCaptureCallback } = require("process");
const User = require("../models/User.model");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
 
// resetPassword token
exports.resetPasswordToken = async(req, res) =>{
  try{
    const { email } = req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(403).json({
        success: false,
        message: "Your email is not registered with us!",
      });
    }
    
    // generating token for instance
    const token = crypto.randomUUID();

    // updating user bny adding token and expiration time 
    const updatedDetails = await.User.findOneAndUpdate(
        {email},
        {
          token: token,
          resetPasswordExpires = Date.now() + 5 * 60 * 1000,
        },
        { new: true }
    );

    // creating url
    const url = `http://localhost:3000/update-password/${token}`;

    // sending mailSender
    await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);


    return res.json({
      success: true,
      message: "Email sent successfully. please check email and change password before link expires!",
    });
  }
  catch(error){
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "facing error while reseting the token for password!",
    })
  }
}



// reset password
exports.resetPassword = async(req, res) => {
  try{
      const { password, cPassword, token } = req.body;
      
      if(password !== cPassword){
        return res.json({
          success: false,
          message: "password is not matching | plase matcah the password and confirm password",
        });
      }

    // getting user details from DB using token
      const userDetails = await User.findOne({token: token});

    // if not entry and it means invalid toekn
      if(!userDetails){
        return res.status(403).json({
          success: false,
          message: "Token is Invalid | please make a proper token for verification!",
        });
      }

    // checking token time 
      if(userDetails.resetPasswordExpires < Date.now() ){
        return res.status(403).json({
          success: false,
          message: "Token is expired | please regenerate the token",
        });
      }

    // password hashing
      const hashedPassword = await bcrypt.hash(password, 10);

    // Updating password
      await User.findOneAndUpdate(
        {
          token: token
        },
        {
          password: hashedPassword
        },
        {
          new: true
        },
      );

    // returning res
      return res.status(200).json({
        success: true,
        message: "Password reset successfull",
      });
      
  }
  catch(error){
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "facing error while reseting password",
    });
}
