const SubSection = require("../models/SubSection.model");
const Section = require("../models/Section.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
const folder_name = process.env.FOLDER_NAME;

exports.createSubSection = async(req, res) => {
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
    const { sectionId, subSectionId, title, timeDuration, description } = req.body;

    const subSection = await SubSection.findById(subSectionId);
    
    if(!sectionId){
      return res,status(403).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }

    if(req.files && req.files.videoUrl !== undefined){
      const video = req.files.videoUrl;
      const uploadDetails = await uploadImageToCloudinary(video, folder_name);
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save();

    //finding updated sectiona nd return it

    const updatedSection = await Section.findByIdAndUpdate(sectionId).populate(
      "subSection"
    );
    console.log("updated section", updatedSection);

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
exports.deleteSubSection = async(req, res) => {
  try{
    const { subSectionId, sectionId } = req.body;

    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });
    
    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.status(200).json({
      success: true,
      message: "sub section deleted successfully!",
      data: updatedSection,
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
