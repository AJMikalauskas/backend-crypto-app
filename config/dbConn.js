const mongoose = require('mongoose');
const fsPromises = require("fs").promises;
const path = require("path");

const connectDB = async () => {
    try {
        // See Docs to understand the options passed in 2nd param objec; 1st param is the connection string
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch(err) {
        console.log(err)
;    }
}

module.exports = connectDB;