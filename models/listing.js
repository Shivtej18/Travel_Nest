const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: 'listingimage'
        },
        url: {
            type: String,
            default: 'https://images.unsplash.com/photo-1747746431118-c03563a55d3e?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
    },
    // image : {
    //      type: String,

    //     default:"https://images.unsplash.com/photo-1747746431118-c03563a55d3e?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set: (v) => v==="" ? "https://images.unsplash.com/photo-1747746431118-c03563a55d3e?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    // },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,    //review id's
            ref: "Review"
        }
    ]
});

//mongoose middleware to delete related reviews
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews }});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;