const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    // Make sure we have cookies which will include the refreshToken --> optional chaining to check if cookie exists 
        // and if so tries to access jwt property
    const cookies = req.cookies;
    console.log(cookies.jwt);
    if(!cookies?.jwt) return res.sendStatus(401);

    // Retieve the refreshToken, now that we know it's in the cookies
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    // find user with the current refreshToken passed in 
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser) return res.sendStatus(403); // Forbidden -> there should be no refreshToken if the user doesnt't have the refreshToken
    
    // evaluate jwt --> do through jwt.verify() method
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.email !== decoded.email) return res.sendStatus(403) //Forbidden
            // create access token
            const accessToken = jwt.sign(
                {"email": decoded.email},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            )
            res.json({ accessToken })
        }
    )

}
module.exports = { handleRefreshToken }