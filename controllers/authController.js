// Similar to useState() hook in react
const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt');

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
        res.json({ 'success': `User ${email} is logged in!`})
    } else {
        res.sendStatus(401);
    }
}
module.exports = { handleLogin }