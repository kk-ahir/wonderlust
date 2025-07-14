const User = require("../models/user.js");

module.exports.signup = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);

        req.logIn(registeredUser, (err) => {
            if (err) {
                req.flash("error", "Login failed. Please try again.");
                return res.redirect("/signup");
            }
            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message); // Will show "A user with the given username is already registered"
        res.redirect("/signup");
    }
};

module.exports.Login = async (req, res) => {
    req.flash("success", "welcome to wonderlust");
    let url = res.locals.redirectUrl || "/listings";
    res.redirect(url);
};

module.exports.Logout=(req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You logged out");
        res.redirect("/listings");
    });
};

module.exports.loginFormRender=(req, res) => {
    res.render("user/login.ejs");
};

module.exports.signupFormrender=(req, res) => {
    res.render("user/signup.ejs");
};