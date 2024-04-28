const express = require("express");
const router = express.Router();

const { auth, isStudent, isInstructor, isAdmin } = require("../middlewares/auth");

const { 
    createCourse,
    getAllCourses,
    editCourse,
    getCourseDetails,
    getFullCourseDetails,
    getInstructorCourses,
    deleteCourse,
} = require("../controllers/Course");

const {
    createCategory,
    getAllCategories,
    categoryPageDetails
} = require("../controllers/Category");

const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");


const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require("../controllers/SubSection");


const {
    createRating,
    getAllRatings,
    getAverageRating,
} = require("../controllers/RatingAndReview");

const { updateCourseProgress } = require("../controllers/CourseProgress");


//                           Course routes
// ----------------------------------------------------------------

router.post("/createCourse", auth, isInstructor, createCourse); // Courses can Only be Created by Instructors
router.get("/getAllCourses", getAllCourses); // Get all Courses
router.post("/editCourse", auth, isInstructor, editCourse); // Edit Courses
router.post("/getCourseDetails", getCourseDetails); // Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails); // Get Details for a Specific Courses
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses); //Get all Courses Under a Specific Instructo
router.delete("/deleteCourse", auth, isInstructor, deleteCourse); // Deleting a Course

router.post("/addSection", auth, isInstructor, createSection); //Adding a Section to a Course
router.post("/updateSection", auth, isInstructor, updateSection); // updatinga  section
router.post("/deleteSection", auth, isInstructor, deleteSection); // Deleting a Section from a Course

router.post("/addSubSection", auth, isInstructor, createSubSection); // Adding a Sub Section to a Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection); // Updating a Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection); // Deleting a Sub Section

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);



// ------------------------------------------------------------------------------------------------
//                          Category routers(for only Admin)
// ------------------------------------------------------------------------------------------------

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryPageDetails", categoryPageDetails);



// ------------------------------------------------------------------------------------------------
//                          Rating and Review routers
// ------------------------------------------------------------------------------------------------


router.post("/createRating", auth, isStudent, createRating)
router.get("/getReviews", getAllRatings);
router.get("/getAverageRating", getAverageRating);


module.exports = router;

