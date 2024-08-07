const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust2";

main()
    .then(() =>{
        console.log("Connected to database");
    })
    .catch(err => console.log(err) );

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner: "669ea52d20043ff9d4b18b76"}));
    await Listing.insertMany(initData.data);
    console.log("Data saved in DB");
};


initDB();