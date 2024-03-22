const Course = require("../models/Course.model");
const Category = require("../models/Category.model");
const Section = require("../models/Section.model");
const SubSection = require("../models/SubSection.model");
const User = require("../models/User.model");
const CourseProgress = require("../models/CourseProgress.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
require("dotenv").config();

const folder_Name = process.env.FOLDER_NAME;
// handlear for create course

exports.createCourse = async(req, res) => {
  try{
    const { courseName, courseDescription, whatYouWillLearn, price, tag: _tag, category, status, instructions: _instructions  } = req.body;
    const { thumbnail } = req.files.thumbnailImage;
    const userId = req.user.id;
    
    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);
    console.log("tag", tag);
    console.log("instructions", instructions);


    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length || !category || !thumbnail || !instructions.length ){
        return res.json({
            success: false,
            message: "All fields are mandatory!, Please fill all the fields",
        });
    }

    if(!status || status === undefined){
      status = "Draft"
    }


    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    })

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
      WhatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
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

    // updataing schema of category

    await Category.findByIdAndUpdate({
      _id:category
    }, { $push: { courses: newCourse._id } });


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
      const allCourses = await Course.find({ 
        status: "Published" 
      }, {
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
};

//logic for edit course

exports.editCourse = async(req, res) => {
  try{
    const { courseId } = req.body;
    const updates = req.body;
    
    const course = await Course.findById(courseId);

    if(!course){
      return res.status(404).json({
        success: false,
        message: "course not found",
      });
    }

    // here we updatae thumbnail immage if we found it
    if(req.files){
      console.log("updating thumbnail");
      const thumbnail = req.files.thumbnailImage;

      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        folder_Name
      )
        course.thumbnail = thumbnailImage.source_url;
    }

    // here we are updating the fields that are present in the request body
    for(const key in updates){
      if(updates.hasOwnProperty(key)){
        if(key === "tag" || key === "instructions"){
          course[key] = JSON.parse(updates[key]);
        }
        else{
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    }).exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })

  }
  catch(error){
    console.error(error)
    return res.status(400).json({
      success: false,
      message: error.message || "error occurs while editing Course, Please try again",
    })
  }
};

// logic for getting single course

exports.getCourseDetails = async(req, res) =>{
  try{
    const { courseId } = req.body;
    const courseDetails = await Course.findOne({
      _id: courseId,
    }) 
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      }
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
        select: "-videoUrl",
      },
    })
    .exec();

    if(!courseDetails){
      return res.status(404).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }


    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      })
    });


    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      message: "course details fetched successfully",
      data: {
        courseDetails,
        totalDuration,
      },
    })
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFullCourseDetails = async(req, res) => {
  try{
    const { courseId } = req.body;
    const userId = req.user.id;

    const courseDetails = await Course.findOne({
      _id: courseId,
    })
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    console.log("course progress count : ", courseProgressCount );

    if(!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      })
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      message: "course details fetched successfully",
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos 
          : [],
      },
    })
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// logic for getting all courses of a given instructor
exports.getInstructorCourses = async(req, res) => {
  try{
    const instructorId = req.user.id;

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      message: "courses fetched successfully",
      data: instructorCourses,
    })
  }
  catch(error){
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};


exports.deleteCourse = async(req, res)=> {
  try{
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if(!course){
      return res.status(404).json({
        success: false,
        message: "course not found",
      });
    }

    // here code for unenrolling students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for(const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // deleting sections and sub-sections

    const courseSections = course.courseContent;
    for(const sectionId of courseSections){
      const section = await Section.findById(sectionId)
      if(section){
        // deleting sub-sections of the section
        const subSections = section.subSection;
        for(const subSectionId of subSections){
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      // deleting the section
      await Section.findByIdAndDelete(sectionId);
    }

    // deleting the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "course deleted successfully",
    });
  }
  catch(error){
    console.error(error)
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};