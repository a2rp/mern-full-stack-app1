const User = require("../models/user.model");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcrypt");


// register
module.exports.register = async (req, res, next) => {
    // console.log(req.body, "req.body");
    try {
        const { name, email, phone, gender, hear_about_this, city, state, password, confirm_password } = req.body;
        if (!name || !email || !phone || !gender || !hear_about_this || !city || !state || !password || !confirm_password) {
            return res.json({
                success: false,
                message: "All fields are requied."
            });
        }

        if (password.trim() !== confirm_password) {
            return res.json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }

        const user = await User.create({ name, email, phone, gender, hear_about_this, city, state, password });
        const token = createSecretToken(user._id);
        res.cookie("token", token, { withCredentials: true, httpOnly: false, });
        res.status(201).json({
            success: true,
            message: "User signed in successfully",
            user
        });
        next();
    } catch (error) {
        // console.error(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// login
module.exports.login = async (req, res, next) => {
    // console.log(req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                success: false,
                message: 'All fields are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'Email not registered'
            });
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({
                success: false,
                message: 'Incorrect Password'
            });
        }

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        // console.log(token, "token1");
        res.status(201).json({
            success: true,
            message: "User logged in successfully"
        });
        next();
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
}
