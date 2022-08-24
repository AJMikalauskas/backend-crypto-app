// Mongoose Datam Model Schema For User
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },   
    lastname: {
        type: String,
        required: true
    },   
    email: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },  
    password: {
        type: String,
        required: true
    },   
    refreshToken: String,
    watchList: {
        type: Array
    }
})

module.exports = mongoose.model("Users",userSchema);