const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const allListing = await Listing.find({}); //.find({}) method returns queryobj,ect.
    res.render("listings/index.ejs", { allListing });
}

module.exports.renderCreateForm = async (req, res) => {
    res.render("listings/create.ejs");
}

module.exports.createNewlisting = async (req, res, next) => {

    if (!req.body.listing) {
        throw new CustomError("Enter valid data", 400); //400 for bad request.
    }
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;    //save current user information using userid
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New list created.");
    res.redirect("/listings");
    // } catch (err) {
    //     next(new CustomError(err.message, 500));
    //}
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", populate: {
                path: "author",
            }
        })
        .populate("owner", "username");     //.populate is method.
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    // let originalImageUrl = listing.image.url;
    // originalImageUrl = originalImageUrl.replace(".upload","/upload/h_300,w_200");
    res.render("listings/edit.ejs", { listing});
}

module.exports.updateEditForm = async (req, res) => {
    let { id } = req.params;  //extract id
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //extract listing , pass parameter id & listing. listing is deconstructed.
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename
        listing.image = { url, filename };
        await listing.save();
    }


    req.flash("success", "Listing updated !");
    res.redirect("/listings");
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted listing.");
    console.log(deletedListing);
    res.redirect("/listings");
}
