const Profile = require("../models/Profile.model");
const User = require("../models/User.model");

exports.updateProfile = async(req, res) => {
  try{
    const{ gender, dateOfBirth="", about="", contactNumber } = req.body;
    const id = req.user.id;

    if( !gender || !contactNumber || !id ){
        return res.status(400).json({
          success: false,
          message: "All fields are required. Please fill all the fields ",
        });
    }

    //finding profilee
    const userDetails = await User.findById(id);
    
    const profileId = userDetails.aditonalDetails;
    const profileDetails = await Profile.findById(profileId);

    // updating profile in db
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber; 

    await profileDetails.save();

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
exports.deleteAccount. = async(req, res) => {
  try{
      const id = req.user.id;

      const userDetails = await User.findById(id);
      if(!userDetails){
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }
    
      // deleting profile after getting user detail with uid 
      
       await Profile.findByIdAndDelete({_id: userDetails.aditonalDetails});
      
            
       // TODO: i heve to wrtitye a login for deleteing from endrolledStudent from all course 
      
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

     return res.status(200).json({
        success: true,
        message: "user Data fetched successfully",
     })
  }
  catch(error){
   console.log("error in geting al user: ", error);
    return res.status(400).json({
      success: false,
      message: "error occurs while getting all user details, please try again",
    });
  }
}

