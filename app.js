
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();      
}
const cloudinary = require('cloudinary').v2;

const express = require("express");      // set up express server
const app = express();
const port = 8080;
const Listing = require("./models/listing.js");

const methodOverride = require("method-override");
const CustomError = require('./util/customError.js');
const wrapAsync = require("./util/wrapAsync.js");
const Review = require("./models/reviews.js");
const { reviewSchema } = require('./schema.js');
const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./router/user.js");
const ExpressError = require("./util/customError");



const sessionOptions = {
    secret:"mysupersecretestring",
    resave:false,
    saveUninitialized: true,
    cookie: {
        expires : 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true , //prevent's from cross scripting attacks.
    }
}

app.use(session(sessionOptions));   
app.use(flash());


app.use(passport.initialize());
app.use(passport.session()); //these two must be called before locals otherwise we will not get value of currUser.
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true })); // Middleware for form submissions
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
const cookie = require("express-session/session/cookie.js");
app.use(express.json()); // Middleware to parse JSON requests


app.use(express.static(path.join(__dirname, "/public")));

app.use("/listings/",listingRouter);  //Express router used.
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

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