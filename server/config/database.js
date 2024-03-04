const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () =>{
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Db connect successfully!"))
    .catch((error) => {
        console.log("Db connection failed");
        console.error(error);
        process.exit(1);
    })
};