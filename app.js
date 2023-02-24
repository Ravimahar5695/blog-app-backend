const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const categoryRoutes = require("./routes/category");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");

mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Successfully connected to database");
}).catch((err) => {
    console.log(err);
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", categoryRoutes);
app.use("/", adminRoutes);
app.use("/", contactRoutes);



app.get("/", (req, res) => {
    res.send("Blog App Backend");
});


app.listen(process.env.PORT || 4500, () => {
    console.log(`App is running...`);
});