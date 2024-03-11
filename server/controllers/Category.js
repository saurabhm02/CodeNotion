const Category = require("../models/Category.model");

exports.createCategory = async(req, res) => {
  try{
    const { name, description } = req.body;
    
    if(!name || !description ){
        return res.json({
          success: false,
          message: "All fields are required, Please fil all the details",
        });
    }

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log("category Details: ", categoryDetails);

    return res.json({
      success: true,
      message: "category created successfully!",
    });

  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "error while creating category, please try again"
    });
  }
};

// logic for getAllcategories handler

exports.getAllCategories = async(req, res) => {
  try{
      
      const allCategories = await Category.find({}, {name:true, description:true});
      res.status(200).json({
        success: true,
        message: "All Categories return successfully!",
        allCategories,
      });
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "error occurs while getting all categories, please try again!",
    });
  }
}

// logic for category page details

exports.categoryPageDetails = async(req, res) => {
  try{
    const { categoryId } = req.body;
    console.log("category id: ", categoryId);

    const selectedCategory = await Category.findById(categoryId)
    .populate({
      path: "courses",
      match: { status: "Published"},
      populate: "ratingAndReviews",
    })
    .exec();

    console.log("category Details: ", selectedCategory);

    if(!selectedCategory){
      console.log("Category not found.")
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }

    // handling the case when there are not courses
    if(selectedCategory.courses.length === 0){
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }


    // gett the courses for other categories

    const categoriesExcrptSeclected = await Category.find({
      _id: {
        $ne: categoryId
      },
    })

    let differentCategory = await Category.findOne(
      categoriesExcrptSeclected[getRandomInt(categoriesExcrptSeclected.lenght)]._id
    )
    .populate({
      path: "courses",
      match: { status: "Published"},
    }).exec();

    const allCourses = allCategories.findMap((category) => category.courses);
    const mostSellingCourses = allCourses
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}


