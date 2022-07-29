// Similar to useState() hook in react
const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt');

// JWT necessary imports
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req,res) => {
    // Email and Password fields are required
    const { email, password } = req.body
    if(!email || !password) return res.status(400).json({'message': 'Email and Password are required.'});

    // The email has to already exist, else they can't login
    const foundUser = usersDB.users.find(person => person.email === email)
    if(!foundUser) return res.sendStatus(401); // Unauthorized
    
    // evaluate password
    const match = bcrypt.compare(password,foundUser.password);
    // If the password matches, send success message, else, send a 401 unauthorized error code
    if(match) {
        // create JWTS here
        const accessToken = jwt.sign(
            {"email": foundUser.email},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        )
        const refreshToken = jwt.sign(
            {"email": foundUser.email},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        )

        // SAVING REFRESH TOKEN WITH CURRENT USER
        // Filters out the user who is currently logging in
        const otherUsers = usersDB.users.filter(person => person.email !== foundUser.email);
        // Create a new user by using the foundUser yet also adding the refreshToken --> will allow us to invalidate user later 
            // based on logout functionality
        const currentUser = { ...foundUser, refreshToken};
        usersDB.setUsers([...otherUsers, currentUser])

        // Add updated usersDB to the users.json file
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        // Not available to JS if we send refreshToken as httpOnly cookie; maxAge is 1 day but in miliseconds.
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        // send accessToken via here as res.json({}) --> send to memory, not localStorage or cookies
        res.json({ accessToken });
        //res.json({ 'success': `User ${email} is logged in!`})
    } else {
        res.sendStatus(401);
    }
}
module.exports = { handleLogin }