const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {

    // Send a 401 if the authHeader of the req headers authorization is falsy.
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);
    // not exactly sure what the authHeader is, console log when we are testing for it.
    console.log(authHeader);

    // Pass in token to the "Bearer Token ..."
    const token = authHeader.split(' ')[1];
    // Verify token here using the jwt.verify() method --> Synchronously verify given token using a secret or a public key 
        // to get a decoded token token - JWT string to verify secretOrPublicKey
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        // Callback function is the 3rd parameter
        (err,decoded) => {
            if(err) return res.sendStatus(403); // invalid token, token was tampered with, but we know we received the token
            req.user = decoded.email;
            // calls next to move onto more middleware or move past the current middleware.
            next();
        }
    )
}

module.exports = verifyJWT;