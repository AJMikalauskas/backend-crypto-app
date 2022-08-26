const User = require("../model/User");

const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    // Make sure we have cookies which will include the refreshToken --> optional chaining to check if cookie exists 
        // and if so tries to access jwt property
    const cookies = req.cookies;
    console.log(cookies.jwt);
    if(!cookies?.jwt) return res.sendStatus(401);

    // Retieve the refreshToken, now that we know it's in the cookies
    //console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    // find user with the current refreshToken using MongoDB logic; done so in same format as registerController.js
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) return res.sendStatus(403); // Forbidden -> there should be no refreshToken if the user doesnt't have the refreshToken
    
    // evaluate jwt --> do through jwt.verify() method
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.email !== decoded.email) return res.sendStatus(403); //Forbidden
            // add roles to accessToken, everytime a new accessToken is made anywhere in the code: here and in authController.js
            const roles = Object.values(foundUser.roles);
            // create access token
            const accessToken = jwt.sign(
                {        
                    "UserInfo": {
                    "email": decoded.email,
                    "roles": roles,
                  },
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1200s'}
            )
            console.log(accessToken);
            res.json({ roles, accessToken })
        }
    )

}
module.exports = { handleRefreshToken }