const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, "Name Required"],
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Invalid Email"
        },
        required: [true, "Email Required"]
    },
    mobile: {
        type: String,
        trim: true,
        required: [true, "Phone Number Required"],
        unique: true,
    },
    userId: {
        type: String,
        trim: true,
        required: [true, "User ID required"]
    }
}, { timestamps: true });


module.exports = mongoose.model("Contact", contactSchema);

