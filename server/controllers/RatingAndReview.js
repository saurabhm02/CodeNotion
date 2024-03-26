const ratingAndReview = require("../models/RatingAndReview.model");
const Course = require("../models/Course.model");
const { mongoose } = require("mongoose");

exports.createRating = async(req, res) => {
    try{
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: {
                $elemMatch: {
                    $eq: userId
                }
            }
        });

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            });
        }

        // checking that if user is already reviewwed the course 
        const alreadyReviewed = await ratingAndReview.findOne({
            userId: userId,
            courseId: courseId
        });

        if(alreadyReviewed){
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this course",
            });
        }

        // creating rating and review

        const newRating = ratingAndReview.create({
            userId: userId,
            courseId: courseId,
            rating: rating,
            review: review
        });

        // updating course with rating , reviews

        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id: courseId},
            {
                $push: {
                    ratingAndReviews: newRating._id,
                },
            },
            { new: true}
        );

        console.log("updatedCourseDetails: ", updatedCourseDetails);

        return res.status(201).json({
            success: true,
            message: "Rating and review created successfully",
            ratingAndReview: newRating
        });
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getAllRatings = async(req, res)=>{
    try{
        const allReviews = await ratingAndReview.find({})
            .sort({rating: "desc"})
            .populate({
                 path: "userId",
                 selected: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "All ratings fetched successfully",
             ratings: allReviews
        });
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getAverageRating = async(req, res)=>{

    try{
        const courseId = req.body.courseId;

        const result = await ratingAndReview.aggregate([
            {
                $match: {
                    courseId: mongoose.Types.ObjectId(courseId)
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    }
                }
            }
        ]);

        if(result.length > 0 ){
            return res.status(200).json({
                success: true,
                message: "Average rating fetched successfully",
                averageRating: result[0].averageRating
            })
        }

        // if rating review not exist

        return res.status(200).json({
            success:true,
            message:'Average Rating is 0, no ratings given till now',
            averageRating:0,
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


