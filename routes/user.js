const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");


router.route("/signup")
    .get(userController.signupFormrender)
    .post(userController.signup);


router.route("/login")
    .get(userController.loginFormRender)
    .post(saveUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        userController.Login
    );



router.get("/logout", userController.Logout);


module.exports = router;