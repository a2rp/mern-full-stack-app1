require("dotenv").config();

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
    const token = req.cookies.token;
    // console.log(token, "token");
    if (!token) {
        return res.json({
            success: false,
            message: "Token required"
        });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({
                success: false,
                message: err.message
            });
        } else {
            const user = await User.findById(data.id);
            // console.log(user, "user before if");
            if (user) {
                // console.log(user, "user found");
                return res.json({
                    success: true,
                    user: { username: user.name, email: user.email }
                });
            } else {
                return res.json({
                    success: false,
                    message: "User not found"
                });
            }
        }
    });
}
