const mongoose = require("mongoose");
const initdb = require("./data.js");
const Listing = require("../models/Listing.js");


const mongoUrl = 'mongodb://127.0.0.1:27017/wonderlust'
main().then((result) => {
    console.log("connection succes");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongoUrl);
};

const db = async () => {
    await Listing.deleteMany({});
    initdb.data=initdb.data.map((obj)=>({
        ...obj,
        owner:"6872919ef500e48c7908a2bf"
    }));
    await Listing.insertMany(initdb.data);
    console.log("success");
}

db();