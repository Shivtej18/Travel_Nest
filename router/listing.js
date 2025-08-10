const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const listing = require("../router/listing.js");
const Listing = require("../models/listing.js");


const validateReviw = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); //here we validate request body using reviewSchema 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


//APP IS REPLACESD  BY router

//index route                               
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListing = await Listing.find({}); //.find({}) method returns queryobject.
        res.render("listings/index.ejs", { allListing });
    }));

//create new route
router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/create.ejs");
}));

router.post("/", wrapAsync(async (req, res, next) => {

    if (!req.body.listing) {
        throw new CustomError("Enter valid data", 400); //400 for bad request.
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/");
    // } catch (err) {
    //     next(new CustomError(err.message, 500));
    //}
}));

//Show route
router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");    //.populate is method.
    res.render("listings/show.ejs", { listing });
}));

//edit & Update
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;  //extract id
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //extract listing , pass parameter id & listing. listing is deconstructed.
    res.redirect("/listings");
}));

//DELETE route    
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//review
//POST review on localhost8080/:id/review
router.post("/:id/reviews", validateReviw, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);      //find required listing to store review.
    let newReview = new Review(req.body.review);    //R is capital because it is model.

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)
}));

//DELETE review
router.delete("/:id/reviews/:reviewId",
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
        res.redirect(`/listings/${id}`);
    }));

module.exports = router; //router object is exported.    