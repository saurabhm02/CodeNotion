const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User.model");
const jwt_secret = process.env.JWT_SECRET;

exports.auth = async( req, res, next ) => {
  try{
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer", "").trim();
    
    // check if token is missing or not
    if(!token){
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try{
      const decode = jwt.verify(token, jwt_secret);
      console.log(decode);
      req.user = decode;
    }
    catch(err){
      console.log(err);
        return res.status(401).send({
          success: false,
          message:"Token is invalid"
       });
    }
    next();
  }
  catch(error){
      console.log(err);
      return res.status(401).send({
        success: false,
        message:"Some error occurred while authenticating."
      });
  }
};


exports.isStudent = async(req, res, next) =>{
  try{
     if(req.user.accountType !== "Student"){
       return res.status(401).json({
          success: false,
          message: "You are not authorized as student  to access this route"
       });
     }
     next();
  }
  catch(error){
     console.log(error);
     return res.status(401).send({
       success: false,
       message:"Some error occurred while authenticating the student"
    });
  }
}


exports.isInstructor = async(req, res, next) => {
  try{
     if(req.user.accountType !== "Instructor"){
        return res.status(401).json({
          success: false,
         message: "You are not authorized as Instructor to access this route"
        });
     }
     next();
  }
  catch(error){
    console.log(error);
    return res.status(401).send({
        success: false,
        message:"Some error occurred while authenticating the Admin"
    });
  }
};

exports.isAdmin = (req, res, next) =>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "You are not authorized as Admin  to access this route"
            });
        }

        next();
    } catch(error){
        console.log(error);
        return res.status(401).send({
            success: false,
            message:"Some error occurred while authenticating the Admin"
        });
    }
};

