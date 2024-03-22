const Profile = require("../models/Profile.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const Course = require("../models/Course.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const convertSecondsToDuration = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress.model");
require("dotenv").config();

const folder_Name = process.env.FOLDER_NAME;

exports.updateProfile = async(req, res) => {
  try{
    const{ firstName="", lastName="", gender="", dateOfBirth="", about="", contactNumber="" } = req.body;
    const id = req.user.id;

    //finding profilee
    const userDetails = await User.findById(id);
    
    const profileId = userDetails.aditonalDetails;
    const profileDetails = await Profile.findById(profileId);

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    await user.save();


    // updating profile in db
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber; 

    await profileDetails.save();

    const updateUserDetails = await User.findById(id)
    .populate("additionalDetails")
    .exec();
    
    return res.status(200).json({
      status: true,
      message: "Profile update successfully!",
      profileDetails,
    });
  }
  catch(error){
    console.log("error in Profil: ", error);
    return res.status(400).json({
      success: false,
      message: "error occurs while updating Profile details, please try again!",
    });
  }
};


// logic for deleting account
exports.deleteAccount = async(req, res) => {
  try{
    const id = req.user.id;

    const userDetails = await User.findById({ _id: id });

    if(!userDetails){
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    
    // deleting profile after getting user detail with uid 
      
    await Profile.findByIdAndDelete({
      _id: new mongoose.ObjectId(userDetails.aditonalDetails),
    });

    for(const courseId of userDetails.courses){
      await Course.findByIdAndUpdate(
        courseId,
        {
          $pull: {
            studentsEnroled: id,
          },
        },
        { new: true }
      )
    }

    // deleting user aftyer deletng itys profile / additiondetail

    await User.findByIdAndDelete({_id: id});

    return res.status(200).json({
      success: true,
      message: "account deleted successfully!",
    });
  }
  catch(error){
    console.log("error in delete Acc: ", error);
    return res.status(400).json({
      success: false,
      message: "error occurs while deleting account, please try again!",
    });
  }
};

exports.getAllUserDetails = async(req, res) => {
  try{
    const id = req.user.id;
    
    // validating and get user details
    const userDetails = await User.findById(id).populate("additiondetail").exec();
    console.log("userDetails: ", userDetails);

    return res.status(200).json({
      success: true,
      message: "user Data fetched successfully",
    })
  }
  catch(error){
   console.log("error in geting al user: ", error);
    return res.status(400).json({
      success: false,
      message: error.message || "error occurs while getting all user details, please try again",
    });
  }
};


exports.updateDisplayPicture = async(req, res) => {
  try{
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(
      displayPicture,
      folder_Name,
      1000,
      1000
    )
    console.log(image);

    const updateProfile = await User.findByIdAndUpdate(
      { _id: userId },
      {
        image: image.secure_url,
      },
      { new: true }
    )
    res.send({
      success: true,
      message: "Display picture updated successfully!",
      data: updateProfile,
    })
  }
  catch(error){
    console.log("error in updateDisplayPicture: ", error);
    return res.status(400).json({
      success: false,
      message: error.message || "error occurs while updating display picture, please try again",
    });
  }
};

exports.getEnrolledCourses = async(req, res ) => {
  try{
    const userId = req.user.id;

    let userDetails = await User.findOne({
      _id: userId,
    })
    .populate({
      path: "courses",
      populate: {
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      },
    })
    .exec()

    userDetails = userDetails.toObject();

    var SubsectionLength = 0;
    for(var i=0; i< userDetails.courses.length; i++){
      let totalDuration = 0;
      SubsectionInSeconds = 0;
      for(var j=0; j< userDetails.courses[i].courseContent.length; j++){
        totalDuration += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length;
      }

      let courseProgressCount = await CourseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      });

      courseProgressCount = courseProgressCount?.completedVideos.length;
      if(SubsectionLength === 0){
        userDetails.courses[i].progressPercentage = 100;
      }
      else{
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async(req, res) => {
  try{
    const instructor = req.user.id;
    const courseDetails = await Course.find({ instructor });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;


      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,

        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats;
    });
    res.status(200).json({
      success: true,
      courses: courseData,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

