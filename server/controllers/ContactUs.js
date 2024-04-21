const { contactUsEmail } = require("../mail/template/contactFormTemplate");
const mailSender = require("../utils/mailSender");

exports.contactUs = async(req, res) =>{
    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
    console.log(req.body);

    try{
        const emailRes = await mailSender(
            email, 
            "your Data send successfully!",
            contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode )
        );
        console.log("email res: ", emailRes);
        
        return res.status(200).json({
            success: true,
            message: "Email send successfully!",
        });
    }
    catch(error){
        console.error("Error occurred while sending email:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error occurred while sending email",
        });
    }
};