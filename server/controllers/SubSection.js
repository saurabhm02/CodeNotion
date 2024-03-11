const SubSection = require("../models/SubSection.model");
const Section = require("../models/Section.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
const folder_name = process.env.FOLDER_NAME;

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;

    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required. Please fill all the fields",
      });
    }

    // Uploading video to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(video, folder_name);

    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // Updating section with this subSection ObjectId
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "Sub-section created successfully!",
      updatedSection: updatedSection,
    });
  }
  catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating a sub-section. Please try again.",
      error: error.message,
    });
  }
};


//upading subSection

exports.updateSubSection = async(req, res) => {
  try{
    const { subSectionId, title, timeDuration, description } = req.user;
    if(!subSectionId || !title || !timeDuration || !description){
      return res,status(403).json({
        success: false,
        message: "all fields are required, please fill all the fields",
      });
    }

    const subSection = await SubSection.findByIdAndUpdate(sectionId, {
      tile: title,
      timeDuration: timeDuration,
      description: description,
    },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "sub section updated successfully!",
    });
  }
  catch(error) {
    console.log("error in updating subSection: ", error);
    return res.status(400).json({
      success: false,
      message: "error occurs while updating the sub-section details",
    }); 
  }
}


// deleting sub section
exports.deleteSubSection = async(req, res) = > {
  try{
    const { subSectionId } = req.params;
    const deleteSubSection = await Section.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "sub section deleted successfully!",
    })
  }
  catch(error){
    console.log("error in deleting sub section: ", error);
    return res.status(400).json({
      success: false,
      message: "error occurs while deleting sub section, please try again!",
    });
  }
}
