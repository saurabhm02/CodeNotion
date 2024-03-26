const { instance } = require("../config/razorpay");
const Course = require("../models/Course.model");
const User = require("../models/User.model");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/template/courseEnrollementEmail");
const { paymentSuccessEmail } = require("../mail/template/paymentSuccessfullEmail");
const CourseProgress = require("../models/CourseProgress.model");
require("dotenv").config();

const razorpay_secret = process.env.RAZORPAY_SECRET;


exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user.id;

    if (courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid course ID",
      });
    }
    let total_amount = 0;

    for(const course_id of courses){
      let course;
      try {
        course = await Course.findById(course_id);

        if (!course) {
          return res.status(404).json({
            success: false,
            message: "Course not found",
          });
        }

        // Checking if user is already enrolled in the course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
          return res.status(200).json({
            success: false,
            message: "Student is already enrolled in this course",
          });
        }
        total_amount += course.price;
      } 
      catch (error) {
        console.error("Error in course validation: ", error);
        return res.status(500).json({
          success: false,
          message: "Error occurred while validating course information",
        });
      }
    }

    // Creating order
    const options = {
      amount: amount * 100, // Convert to paisa
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
      // notes: {
      //   courseId: course_id,
      //           userId,
      //       }
    };

    try {
      // Initiating payment using Razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log("Payment response: ", paymentResponse);

      return res.status(200).json({
        success: true,
        message: "Order initiated successfully",
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } 
    catch (error) {
      console.error("Error in payment order: ", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while initiating order",
      });
    }
  } 
  catch (error) {
    console.error("Internal server error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};  


// verifying the signature ofg razorpay and server
exports.verifySignature = async(req, res) =>{
  try{
    const webhooksecret = "saurabh1202";

    const signature = req.headers("x-razorpay-signature");

    // hmac = hassed based message authentication code
    const shaSum = crypto.createHmac("sha256", webhooksecret);
    shaSum.update(JSON.stringify(req.body));
    const digest = shaSum.digest("hex");

    if(signature === digest){
      console.log("Payment is authorized");

      const { courseId, userId } = req.body.payload.payment.entity.notes;

      try{
        // finding the course and enroll the student in it   
        const enrolledCourse = await Course.findOneAndUpdate(
          {_id: courseId},
          { $push: {
            studentsEnrolled: userId
          }},
          { new: true},
        );

        if(!enrolledCourse){
          return res.status(500).json({
              success: false,
              message: "Course not found"
          });
        }
        console.log("enrolled course", enrolledCourse);

        /// finding the student and ad the course to theior lisst of enroled course
        const endrolledStudent = await User.findOneAndUpdate(
          {_id: userId},
          { $push: {
            courses: courseId
          }},
          { new: true},
        );
        console.log("enrolled Student: ", endrolledStudent);

        //sending mail after order completion
        const emailResponse = await mailSender(
          endrolledStudent.email,
          "Congratulation from code notion",
          "Congratulation, you are onboarded into new codeNotion course",
          
        );

        console.log("email response: ", emailResponse);
        return res.status(200).json({
          success: true,
          message: "signature verified and course added",
        });
        
      }
      catch(error){
          console.error("error in verify signature: ", error);
          return res.status(500).json({
            success: false,
            message: error.message || "error occurs while veriging the signature",
          });
      }
      
    }
    else{
      return res.status(400).json({
          success: false,
          message: error.message || "Invalid request",
      });
    }
    
  }
  catch(error){
   console.error("Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    }); 
  }
};

// verifying the payment

exports.verifyPayment = async(req, res) =>{
  const razorPay_order_id = req.body?.razorPay_order_id;
  const razorPay_payment_id = req.body?.razorPay_payment_id;
  const razorPay_signature = req.body?.razorPay_signature;

  const courses = req.user.id;
  const userId = req.user.id;

  if( !razorPay_order_id || !razorPay_payment_id || !razorPay_signature || !courses || !userId ){
    return res.status(400).json({
      success: false,
      message: "payment failed",
    });
  }

  let body = razorPay_order_id + "|" + razorPay_payment_id;

  const expectedSignature = crypto
  .createHmac("sha256", razorpay_secret)
  .update(body.toString())
  .digest("hex");

  if( expectedSignature === razorPay_signature){
    await endrollStudents(courses, userId, res)
    return res.status(200).json({
      success: true,
      message: "payment verified",
    })
  }
  return res.status(200).json({
    success: false,
    message: "payment failed",
  })
};


exports.sendPaymentSuccessEmail = async(req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if(!orderId || !paymentId || !amount || !userId ){
    return res.status(400).json({
      success: false,
      message: "please provide all the details",
    });
  }

  try{
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.$assertPopulated.lastName}`,
        amount / 100,
        orderId,
        paymentId,
      )
    )
  }
  catch(error){
    console.log("error in sending mail", error);
    return res.status(500).json({
      success: false,
      message: "Could not send email",
    });
  }
};

// enrolling the student in the courses
exports.enrollStudents = async(courses, userId, res) => {
  if(!courses || !userId ){
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    });
  }

  for(const courseId of courses){
    try{
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: {
          studentsEnrolled: userId
        }},
        { new: true},
      );

      if(! enrolledCourse ){
        return res.status(500).json({
          success: false,
          message: "Course not found"
        });
      }

      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        userId: userId,
        courseId: courseId,
        completedVideos: [],
      });

      // finding the students and adding the course to their list of enrolled courses
      const endrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $push: {
          courses: courseId,
          courseProgress: courseProgress._id,
        }},
        { new: true},
      );

      console.log("Enrolled student: ", enrolledStudent);

      // sending an email notification to the enrolled students

      const emailResponse = await mailSender(
        endrolledStudent.email,
        `successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${endrolledStudent.firstName} ${endrolledStudent.lastName}`
        )
      )
      console.log("Email sent successfully: ", emailResponse.response);
    }
    catch(error){
      console.log("error in enroll student", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
