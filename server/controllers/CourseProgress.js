const SubSection = require("../models/SubSection.model");
const CourseProgress = require("../models/CourseProgress.model");

exports.updateCourseProgress = async(req, res) =>{
    const { courseId, subsectionId } = req.body;
    const userId = req.user.id;

    try{
        const subsection = await SubSection.findById(subsectionId)
        if (!subsection) {
            return res.status(404).json({ 
                success: false,
                message: "Invalid subsection",
            });
        }

        // Finding the course progress document for the user and course
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });

        if (!courseProgress) {
            // If course progress doesn't exist, create a new one
            return res.status(404).json({
              success: false,
              message: "Course progress Does Not Exist",
            })
        } 
        else {
            // If course progress exists, check if the subsection is already completed
            if (courseProgress.completedVideos.includes(subsectionId)) {
              return res.status(400).json({ error: "Subsection already completed" })
            }
      
            // Pushing the subsection into the completedVideos array
            courseProgress.completedVideos.push(subsectionId)
        }

         // Saving the updated course progress
        await courseProgress.save()

        return res.status(200).json({ 
            success: true,
            message: "Course progress updated" 
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};