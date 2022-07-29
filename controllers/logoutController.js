const User = require('../model/User');

// const fsPromises = require('fs').promises;
// const path = require('path');

const handleLogout = async (req, res) => {
    // On Client, also delete the accessToken

    // Make sure we have cookies which will include the refreshToken --> optional chaining to check if cookie exists 
        // and if so tries to access jwt property
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    // Retieve the refreshToken, now that we know it's in the cookies
    const refreshToken = cookies.jwt;

    // is refreshToken in db?
    // find user with the current refreshToken passed in  --> format explained in refreshTokenController.js and registerController.js
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser)  {
        // Make sure when clearing cookie that all options from previous cookie are in it except for maxAge
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
        return res.sendStatus(204); 
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save(); 
    // for testing
    console.log(result);
    // const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    // const currentUser = {...foundUser, refreshToken: ''};
    // usersDB.setUsers([...otherUsers, currentUser]);
    // // Write the new usersDB.users to the users.json, update the database; will be different when using mongoDB
    // await fsPromises.writeFile(
    //     path.join(__dirname,'..','model','users.json'),
    //     JSON.stringify(usersDB.users)
    // );

     // If you set secure to true as another option, this adds more security; for https server, not for dev
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.sendStatus(204); // Send No COntent Success Code as changes are only deletions

}
module.exports = { handleLogout }