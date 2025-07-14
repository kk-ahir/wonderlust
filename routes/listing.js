const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/Listing");
const ExpressError = require("../utils/ExpressError");
const { ListingSchema, Reviewschema } = require("../Schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const { storage } = require("../cloudConfig.js")
const multer = require('multer')
const upload = multer({ storage })

const listingController = require("../controllers/listings.js");



const validateListing = (req, res, next) => {
    //console.log(req.body); // For debugging
    let { error } = ListingSchema.validate(req.body.listings); // ✅ FIXED
    if (error) {
        console.log("❌ Joi Validation Error:", error);
        let ermsg = error.details.map((el) => el.message).join();
        throw new ExpressError(400, ermsg);
    } else {
        next();
    }
};



// create route
router.get("/new", isLoggedIn, wrapAsync(listingController.createRenderForm));

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listings[image]"), validateListing, wrapAsync(listingController.createListings));



router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listings[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//update route 




module.exports = router;