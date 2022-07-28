// Similar to useState() hook in react
const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}

// fsPromises is for async
const fsPromises = require('fs').promises;
const path = require('path');
//bcrypt is for hashing passwords.
const bcrypt = require('bcrypt');


const handleNewUser = async (req,res) => {
    const { firstname, lastname, email, password} = req.body;
    if(!firstname || !lastname || !email || !password) return res.status(400).json({ 'message': 'All fields are required.'})

    // Check for duplicate emails in DB
    const duplicate = usersDB.users.find(person => person.email === email)
    if(duplicate) return res.sendStatus(409); // Conflict error is a 409 

    try {
        // hash the password -> 2nd param is the salt amount which makes it harder for hackers to hack.
        const hashedPassword = await bcrypt.hash(password, 10) 
        // store the new user
        const newUser = { "firstname": firstname, "lastname": lastname, "email": email, "password": hashedPassword}
        usersDB.setUsers([...usersDB.users, newUser]);
        // 1st param is the path to which code/text is written to; 2nd param is the JSON/code/text that is written to the file
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        // for testing purposes
        console.log(usersDB.users);
        res.status(201).json({ 'success': `New user ${email} created!`});
    } catch(err) {
        // Send error 500 code with error message
        res.status(500).json({ 'message': err.message})
    }
}   

module.exports = { handleNewUser };