const Review = require("../models/reviews.js");
const Listing = require("../models/Listing.js");

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    console.log(res.locals.currUser);
    review.author = res.locals.currUser._id;
    console.log(review.author);
    await review.save();
    await listing.save();
    req.flash("success", "review Craeted ");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "review deleted ");
    res.redirect(`/listings/${id}`);

};