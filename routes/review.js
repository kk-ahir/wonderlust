const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/Listing.js");
const ExpressError = require("../utils/ExpressError");
const { Reviewschema } = require("../Schema.js");
const { isAuthor } = require("../middleware.js");

const reviewController=require("../controllers/reviews.js");


const validateReview = (req, res, next) => {
    let { error } = Reviewschema.validate(req.body);
    if (error) {
        let ermsg = error.details.map((el) => el.message).join();
        throw new ExpressError(400, ermsg);
    } else {
        next();
    }
};

//review's post route
router.post("/", validateReview, wrapAsync(reviewController.createReview));

// reviews's delete route
router.delete("/:reviewid", isAuthor, reviewController.destroyReview);


module.exports = router;
