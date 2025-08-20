const listing = require("../router/listing.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);      //find required listing to store review.
    let newReview = new Review(req.body.review);    //R is capital because it is model.
    newReview.author =  req.user._id; //To save author of new review created. 
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review added.");
    res.redirect(`/listings/${listing._id}`)
}    

module.exports.destroyReview = async (req, res) => {
        let { id, reviewId } = req.params;
        // Remove review reference from listing
        await Listing.findByIdAndUpdate(
            id,
            {
                $pull: { reviews: reviewId }
            });
        // Delete the review itself
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted !");
        res.redirect(`/listings/${id}`);
    }

