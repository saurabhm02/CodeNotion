const mongoose = require("mongoose");

const courseProgressSchema = mongoose.model({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completeVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ]
})

module.exports = mongoose.model("CourseProgress", courseProgress);