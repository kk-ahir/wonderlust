const Listing = require("../models/Listing.js");



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });

}

module.exports.createRenderForm = async (req, res) => {
    res.render("./listings/create.ejs");
};

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner"); // if owner is also a referenced document
    if (!listing) {
        req.flash("error", "listing not exists");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing not exists");
        res.redirect("/listings");
    }
    req.flash("success", "listing edited ");
    let imgurl=listing.image.url;
    let duplicateImage=imgurl.replace("/upload","/upload/h_250,w_250");
    console.log(duplicateImage);
    res.render("./listings/edit.ejs", { listing ,duplicateImage});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let editListing = await Listing.findByIdAndUpdate(id, { ...req.body.listings }, { new: true });
    console.log(req.file);
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        editListing.image = { url, filename };
    }
    await editListing.save()
    req.flash("success", "listing update successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.createListings = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listings);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "listing Craeted ");
    res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted ");
    console.log(deleteListing);
    res.redirect("/listings")
};