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
        url: String,
        filename : String,        
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,    //review id's
            ref: "Review"
        }
    ],
    owner: {
            type: Schema.Types.ObjectId,    //owner id's
            ref: "User"
        },
    // category: {
    //     type: "String",
    //     enum: ["Mountain","Pools", "Forts", "Iconic Cities", "Farms", "Arctic", "Camping", "Waterfalls", "Room"]
    // }    
});

//mongoose middleware to delete related reviews
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews }});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;