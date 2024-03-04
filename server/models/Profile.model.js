const mongoose = require("mongoose");

const profileSchema = mongoose.model({
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type:Number,
        trim: true,
    }
})

module.exports = mongoose.model("Profile", profileSchema);