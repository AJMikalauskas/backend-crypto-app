// from the packages included from installing the date-fns package --> Object destructures it
const {format} = require("date-fns");
// Console logs the current Date and time with format imported function
console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));
// Importing the version 4 but using it's name as uuid using the colon(:)
const {v4:uuid} = require('uuid');

// file reader imports, promises is the async stuff 
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


// logEvents async method
const logEvents = async()


// Randomly generated id comes from this package.
console.log(uuid());