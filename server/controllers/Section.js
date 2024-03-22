const Section = require("../models/Section.model");
const Course = require("../models/Course.model");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Fill all the details",
      });
    }

    const newSection = await Section.create({ sectionName });

    // Updating course with the section ObjectId

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section created successfully!",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "An error occurred while creating a section. Please try again.",
      error: error.message,
    });
  }
};


exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Fill all the details",
      });
    }

    const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

    return res.status(200).json({
      success: true,
      message: "section updated successfully! ",
    });
  }
  catch (error) {
    console.error("Error updating section:", error);
    return res.status(400).json({
      success: false,
      message: "error occurs while updating the section, please try again!",
    });
  }
};


exports.deleteSection = async (req, res) => {
  try {
    const { sectionId,courseId } = req.params;

    await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);

    console.log(sectionId, courseId);

    if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

    // deleting subsection as well after deleting section

    await SubSection.deleteMany({
      _id: {
        $in: section.subSection,
      }
    });

    await Section.findByIdAndDelete(sectionId);

    //finding the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

    return res.status(200).json({
      success: true,
      message: "section deleted successfully!",
    });
  }
  catch (error) {
    return res.status(400).json({
      success: false,
      message: "error occuss while deleting the section, please try again",
    });
  }
}
