const mongoose = require('mongoose');
require('dotenv').config();

db_Url = process.env.DATABASE_URL;

const dbConnect = ()=>{
    mongoose.connect(db_Url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=> console.log("Database connected"))
    .catch((error)=>{
        console.log("Facing issues while connecting to database");
        console.error(error);
        process.exit(1);
    });
};

module.exports = dbConnect;