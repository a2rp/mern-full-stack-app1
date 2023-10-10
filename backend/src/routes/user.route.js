const router = require("express").Router();

const {
    register,
    login,
} = require("../controllers/user.controller");

const {
    userVerification
} = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/", userVerification);

module.exports = router;
