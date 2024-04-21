const express = require("express");
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();

const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");

const { cloudinaryConnect } = require("./config/cloudinary");

const PORT = process.env.PORT || 4000;

dbConnect();
cloudinaryConnect();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);


app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes); 
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
 

app.get("/", (req, res) => {
	// return res.send({
	// 	success:true,
	// 	message:'Your server is up and running....'
	// });
    res.send("hjkdfjsdjfksdaj")
});

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`)
});