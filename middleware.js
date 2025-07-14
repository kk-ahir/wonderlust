const Listing = require("./models/Listing");
const Review = require("./models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you Must be logged in");
        return res.redirect("/login");

    }
    next();
};


module.exports.saveUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!res.locals.currUser._id.equals(listing.owner._id)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { reviewid, id } = req.params;

    // Check if user is logged in
    if (!res.locals.currUser || !res.locals.currUser._id) {
        req.flash("error", "You are not logged in");
        return res.redirect("/login");
    }

    const review = await Review.findById(reviewid);
    const listing = await Listing.findById(id);

    // Handle if review or listing is not found
    if (!review || !listing) {
        req.flash("error", "Review or Listing not found");
        return res.redirect("/listings");
    }

    const currUserId = res.locals.currUser._id;

    // Check if current user is owner of the listing
    const isListingOwner = listing.owner.equals(currUserId);

    // Check if current user is author of the review
    const isReviewAuthor = review.author.equals(currUserId);

    if (!isListingOwner && !isReviewAuthor) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
