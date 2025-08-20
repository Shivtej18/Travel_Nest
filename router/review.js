const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const listing = require("../router/listing.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {validateReview , isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//review
//POST review on localhost8080/:id/review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//DELETE review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports = router; //router object is exported.    

//Common part removed is "/listings/:id/reviews".