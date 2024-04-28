const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async(email, title, body) =>{
    try{
        // console.log("MAIL_HOST:", process.env.MAIL_HOST);
        // console.log("MAIL_USERt:", process.env.MAIL_USER);
        // console.log("MAIL_USER:", process.env.MAIL_PASS);
        
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: "CodeNotion - by Saurabh",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`, 
        });
        console.log("info: ", info);
        return info;
    }
    catch(err){
        console.log(err.message);
    }
};



// const mailSender = async(email, title, body) =>{
//     try{
//         console.log("MAIL_HOST:", process.env.MAIL_HOST);
//         console.log("MAIL_USER:", process.env.MAIL_USER);
//         console.log("MAIL_PASS:", process.env.MAIL_PASS);
//         console.log("Recipient Email:", email); // Adding recipient email logging
        
//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             },
//         });

//         let info = await transporter.sendMail({
//             from: "CodeNotion - by Saurabh",
//             to: `${email}`,
//             subject: `${title}`,
//             html: `${body}`, 
//         });

//         console.log("Mail sent info:", info); // Logging email sending info
//         return info;
//     }
//     catch(err){
//         console.log("Error sending email:", err.message); // Log error message
//         throw err; // Rethrow the error
//     }
// };

module.exports = mailSender;