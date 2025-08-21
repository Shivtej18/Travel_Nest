require('dotenv').config(); // must be at the top
const cloudinary = require('cloudinary').v2;

const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const listing = require("../router/listing.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const {isLoggedIn , isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); //files will be stored at destination uploads at development lv. lateron we will shift to third party application.


//APP IS REPLACESD  BY router

//index route               //controller used. 
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
     isLoggedIn,
     upload.single('image'),
     wrapAsync(listingController.createNewlisting)
     );

//create new route
router.get("/new", isLoggedIn , wrapAsync(listingController.renderCreateForm));

//Show route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,
         isOwner , 
         upload.single('image'), //multer parse img 
         wrapAsync(listingController.updateEditForm)
    )
    .delete(isLoggedIn ,isOwner, wrapAsync(listingController.destroyListing));

//edit & Update
router.get("/:id/edit", isLoggedIn , wrapAsync(listingController.renderEditForm));

module.exports = router; //router object is exported.    
//Common part removed is "/listings".