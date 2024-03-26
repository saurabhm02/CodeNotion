const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { 
    signUp,
    sendOTP,
    login,
    changePassword,
} = require("../controllers/Auth");

const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");


// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

router.post("/signUp", signUp);
router.post("/sendotp", sendOTP);
router.post("/login", login);
router.post("/changePassword", auth, changePassword);


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;