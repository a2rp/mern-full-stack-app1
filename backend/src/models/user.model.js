const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
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
    phone: {
        type: String,
        trim: true,
        required: [true, "Phone Number Required"],
        unique: true,
    },
    gender: {
        type: String,
        trim: true,
        enum: ["male", "female", "others"],
        required: [true, "Gender Required"],
    },
    hear_about_this: {
        type: Object,
        default: {},
        required: [true, "Where did you hear about this ???"],
    },
    city: {
        type: String,
        trim: true,
        enum: ["mumbai", "pune", "ahmedabad"],
        required: [true, "City Required"],
    },
    state: {
        type: String,
        trim: true,
        enum: ["gujarat", "maharashtra", "karnataka"],
        required: [true, "State Required"]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password Required"],
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/)) {
                throw new Error('Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character');
            }
        },
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);

