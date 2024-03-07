const Course = require("../models/Course.model");
const Category = require("../models/Category.model");
const User = require("../models/User.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

const folder_Name = process.env.FOLDER_NAME;
// handlear for create course

exports.createCourse = async(req, res) => {
  try{
    const { courseName, courseDescription, WhatYouWillLearn, price, category  } = req.body;
    const { thumbnail } = req.files.thumbnailImage;
    if(!courseName || !courseDescription || !WhatYouWillLearn || !price || !category || !thumbnail ){
        return res.json({
            success: false,
            message: "All fields are mandatory!, Please fill all the fields",
        });
    }

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);

    console.log("instructor Details: ", instructorDetails);
    
    if(!instructorDetails){
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    // cheeaking givaen category is valid or not 
    
    const categoryDetails = await Category.findById(category);

    if(!categoryDetails){
      return res.status(404).json({
        success: false,
        message: "category Details not found",
      });
    }

    // uploading image to Cloudinary
    
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, folder_Name);
  
    // creating an entry of new course in db
    
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      WhatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });


    // adding new course to the user schema of instructor

     await User.finByIdAndUpdate(
       {_id: instructorDetails._id},
       {
         $push: {
           course: newCourse._id,
         },
       },
       { new: true },
     );

    // updataing schema of tag

    await Category.findByIdAndUpdate(category, { $push: { courses: newCourse._id } });


    // returtn res

    return res.status(200).json({
      success: true,
      message: "course created succussfully! ",
      data: newCourse,
    });

  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error occurs while creating Course, Please try again!",
    });
  }
};



// handler for gett all cuseres

exports.getAllCourse = async(req, res) => {
  try{
      const allCourses = await Course.find({}, {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true, 
      }).populate("instructor")
        .exec();

    return res.status(200).json({
      success: true,
      message: "successfully fetched data of all the courses!",
    });
  }
  catch(error){
    console.log(earror);
    return res.status(400).json({
      success: false,
      message: "error occurs while getting all courses, Please try again",
    })
  }
}
