// Mongoose Data Model Schema For Adding Coin, may use later;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coinSchema = new Schema({
    id: {
        type: String
    },   
    symbol: {
        type: String
    },   
    name: {
        type: String
    },
    image: {
        type: String
    },   
    current_price: { 
        type: Number
    },
    market_cap_rank: {
        type: Number
    }
})

module.exports = mongoose.model("Coins",coinSchema);