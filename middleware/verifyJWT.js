const jwt = require('jsonwebtoken');
const verifyJWT = (req, res, next) => {

    // Send a 401 if the authHeader of the req headers authorization is falsy -> Can be lowercase and uppercase a/A for authorization
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // Not only checking if authHeader passes the optional chaining, but also that it starts with 'Bearer '
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    // not exactly sure what the authHeader is, console log when we are testing for it.
    console.log(authHeader); // Bearer Token

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
            req.roles = decoded.UserInfo.roles;
            // calls next to move onto more middleware or move past the current middleware.
            next();
        }
    )
}

module.exports = verifyJWT;