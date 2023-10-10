require("dotenv").config();

const cookieParser = require("cookie-parser");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const { MONGO_URL, PORT } = process.env;

mongoose.connect(MONGO_URL).then(() => {
    console.log("MongoDB is  connected successfully");
}).catch((err) => {
    console.error(err);
});

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const userRoute = require("./src/routes/user.route");
app.use("/api/v1/user", userRoute);

const contactRoute = require("./src/routes/contact.route");
app.use("/api/v1/contact", contactRoute);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

