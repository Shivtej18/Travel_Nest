const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const listing = require("../router/listing.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { reviewSchema } = require('../schema.js');


const validateReviw = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); //here we validate request body using reviewSchema 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//review
//POST review on localhost8080/:id/review
router.post("/", validateReviw, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);      //find required listing to store review.
    let newReview = new Review(req.body.review);    //R is capital because it is model.

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review added.");
    res.redirect(`/listings/${listing._id}`)
}));

//DELETE review
router.delete("/:reviewId",
    wrapAsync(async (req, res) => {
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
    }));

module.exports = router; //router object is exported.    

//Common part removed is "/listings/:id/reviews".