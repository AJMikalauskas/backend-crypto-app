const User = require("../model/User");

const addCoinToWatchList = async(req,res) => {
    // We can't really assume anything even if the user is already auth for now.
        // For now, i'll just let there not be that much secondary checking such
            // as optional chaining and not sending that many 400 requests as
                // I wouldn't understand how a user would see the table of cryptos 
                    // info without being authenticated but I'll see...
                        // Authenticating Routes?
    const { email, coinData } = req.body;
    // 1. Find user or document of user
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); // Unauthorized
    // 2. Add coin name from request.body to the watchlist array
    foundUser.watchList.push(coinData);
    const result = await foundUser.save();
    console.log(result);
    //3. Updates user info with spread operator --> return response
    res.json({ watchList: foundUser.watchList })
}

const retrieveWatchList = async(req,res) => {
    const { email } = req.body;

    // I will eventually change this foundUser logic to be based on jwt.verify 
        // the refreshToken and maybe compare to the one in the database.
    const foundUser = await User.findOne({ email }).exec();
    if(!foundUser) return res.sendStatus(401); // unauthorized

    res.json({watchList: foundUser.watchList});
}


module.exports = { addCoinToWatchList, retrieveWatchList };
