const express = require("express");      // set up express server
const app = express();
const port = 8080;
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const CustomError = require('./util/customError.js');
const wrapAsync = require("./util/wrapAsync.js");
const Review = require("./models/reviews.js");
const { reviewSchema } = require('./schema.js');
const listing = require("./router/listing.js");

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

app.use("/listings/",listing);

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