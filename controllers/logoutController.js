const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = (req, res) => {
    // On Client, also delete the accessToken

    // Make sure we have cookies which will include the refreshToken --> optional chaining to check if cookie exists 
        // and if so tries to access jwt property
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    // Retieve the refreshToken, now that we know it's in the cookies
    const refreshToken = cookies.jwt;

    // is refreshToken in db?
    // find user with the current refreshToken passed in 
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser)  {
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(403); // Forbidden -> there should be no refreshToken if the user doesnt't have the refreshToken
    }

    // Delete refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers([...otherUsers, currentUser]);
    // Write the new usersDB.users to the users.json, update the database; will be different when using mongoDB
    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.users)
    );

    
}
module.exports = { handleLogout }