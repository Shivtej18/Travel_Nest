const Listing = require("./models/listing.js");
const { reviewSchema } = require('./schema.js');
const Review = require("./models/reviews.js");
const ExpressError = require("./util/customError");

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); //here we validate request body using reviewSchema 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isLoggedIn =(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;

        req.flash("error","User not logedin")
        return res.redirect("/logIn");
    }
    next();
};

//TO save original redirectUrl 
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//To authorize edit , to check owner.
module.exports.isOwner =async (req,res,next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);   //authorization logic<:-)=>
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//To authorize review owner.
module.exports.isReviewAuthor =async (req,res,next) =>{
    let { id,reviewId} = req.params;
    let review = await Review.findById(reviewId);   //authorization logic<:-)=>
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}