if (process.env.NODE_ENV != ("production")) {

    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "Public")))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const dbUrl = process.env.ATLAS_URL;
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 10 * 24 * 60 * 60 * 1000,
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




main().then((result) => {
    console.log("connection succes");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
};




//testing
// app.get("/testListing", async (req, res) => {
//     let newListing = new Listing({
//         title: "my villa",
//         discription: "kk's villa",
//         location: "Bhatiya ,gujarat",
//         country: "India",
//         price: 5600,
//     });
//     let result = await newListing.save();
//     console.log(result);
//     res.send("fnjfbfutwfrtev");
// });

// root 

app.use((req, res, next) => {
    res.locals.msg = req.flash("success");
    res.locals.err = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/user",async(req,res)=>{
// let fakeuser=new User({
//     email:"test@gmail.com",
//     username:"test1"
// });
// let user=await User.register(fakeuser,"test1");
// res.send(user);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.all("*", (re, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, msg = "something went wrong" } = err
    console.log(err);
    res.status(status).send(msg);
});

app.listen(3000, () => {
    console.log("listning:http://localhost:3000/listings");
});