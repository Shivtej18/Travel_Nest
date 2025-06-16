const express = require("express");      // set up express server
const app = express();
const port = 8080;
const Listing = require("./models/listing.js");
const methodOverride = require("method-override"); 
app.use(methodOverride("_method"));

// Seting database
const mongoose = require("mongoose");
const Mongo_URL = 'mongodb://127.0.0.1:27017/TravelNest'
const ejsMate = require ("ejs-mate");

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

app.use(express.static(path.join(__dirname,"/public")));

//index route
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({}); //.find({}) method returns queryobject.
    res.render("listings/index.ejs", { allListing });
});

//create new route
app.get("/listings/new", async (req, res) => {
    res.render("listings/create.ejs");
});

app.post("/listings", async (req,res)=>{
    
   const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//edit & Update
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;  //extract id
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); //extract listing , pass parameter id & listing. listing is deconstructed.
    res.redirect("/listings");
});

//DELETE route

app.delete("/listings/:id", async (req,res)=>{
 let {id} = req.params;
 let deletedListing = await Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 res.redirect("/listings");
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
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