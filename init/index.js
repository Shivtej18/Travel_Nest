const mongoose = require('mongoose');
const initData = require('./data.js');
// const { sampleListings } = require('./data.js'); //error resolved
const Listing = require('../models/listing.js');
const Mongo_URL = 'mongodb://127.0.0.1:27017/TravelNest'

main()
    .then(() => {
        console.log("Connection is successsfull to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(Mongo_URL);
}    

const initDB = async () => {    //to clean already present random data
await Listing.deleteMany({});
await Listing.insertMany(initData.data);
// await Listing.insertMany(sampleListings); //error resolved
console.log("data was initialised");
};

initDB();