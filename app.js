const express = require("express");      // set up express server
const app = express();
const port = 8080;
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const CustomError = require('./util/customError.js');
const wrapAsync = require("./util/wrapAsync");
const Review = require("./models/reviews.js");
const { reviewSchema } = require('./schema.js');

app.use(methodOverride("_method"));

// Seting database
const mongoose = require("mongoose");
const Mongo_URL = 'mongodb://127.0.0.1:27017/TravelNest'
const ejsMate = require("ejs-mate");

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch(() => {
        console.log("err");
    });
async function main() {
    await mongoose.connect(Mongo_URL);
};


const ejs = require('ejs');             //create a template engine.
app.set('view engine', 'ejs');          //set the view engine to ejs
const path = require('path');           //set up path module
app.engine('ejs', ejsMate);

//parse form data
const bodyParser = require('body-parser');
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware for form submissions

app.use(express.static(path.join(__dirname, "/public")));

const validateReviw = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); //here we validate request body using reviewSchema 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({}); //.find({}) method returns queryobject.
    res.render("listings/index.ejs", { allListing });
}));

//create new route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/create.ejs");
}));

app.post("/listings", wrapAsync(async (req, res, next) => {

    if (!req.body.listing) {
        throw new CustomError("Enter valid data", 400); //400 for bad request.
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    // } catch (err) {
    //     next(new CustomError(err.message, 500));
    //}
}));

//Show route
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");    //.populate is method.
    res.render("listings/show.ejs", { listing });
}));

//edit & Update
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;  //extract id
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //extract listing , pass parameter id & listing. listing is deconstructed.
    res.redirect("/listings");
}));

//DELETE route

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//review
//POST review on localhost8080/:id/review
app.post("/listings/:id/reviews", validateReviw, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);      //find required listing to store review.
    let newReview = new Review(req.body.review);    //R is capital because it is model.

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)
}));


app.listen(8080, () => {
    console.log("Listening on port 8080");
});

// This should be after all routes  ..Custom error handling middleware.
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Error";
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error", { err });
});


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Villa",
//         description: "Place to see greenery",
//         price: 1500,
//         location: "Panhala",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("data saved");
//     res.send("successfull testing");
// });