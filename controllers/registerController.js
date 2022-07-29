// // Similar to useState() hook in react
// const usersDB = {
//     users: require("../model/users.json"),
//     setUsers: function (data) { this.users = data }
// }
const User = require("../model/User");

// // fsPromises is for async
//const fsPromises = require('fs').promises;
// const path = require('path');
//bcrypt is for hashing passwords.
const bcrypt = require('bcrypt');


const handleNewUser = async (req,res) => {
    const { firstname, lastname, email, password } = req.body;
    if(!firstname || !lastname || !email || !password) return res.status(400).json({ 'message': 'All fields are required.'})

    // Check for duplicate emails in DB -> must use exec if using async/await --> see documentation for more info
    const duplicate = await User.findOne({ email }).exec();
    if(duplicate) return res.sendStatus(409); // Conflict error is a 409 

    try {
        // hash the password -> 2nd param is the salt amount which makes it harder for hackers to hack.
        const hashedPassword = await bcrypt.hash(password, 10) 
        //const id = usersDB.users?.length ? usersDB.users[usersDB.users.length - 1].id + 1 : 1;
        // create and store the new user -> many other ways to do this in MongoDB 
        const result = await User.create({ 
            //"id": id,
            "firstname": firstname, 
            "lastname": lastname, 
            "email": email, 
            "password": hashedPassword
        });
        console.log(result);
        // const newUser = new User({ 
        //     //"id": id,
        //     "firstname": firstname, 
        //     "lastname": lastname, 
        //     "email": email, 
        //     "password": hashedPassword
        // });
        // const result = await newUser.save(); 
        // usersDB.setUsers([...usersDB.users, newUser]);
        // // 1st param is the path to which code/text is written to; 2nd param is the JSON/code/text that is written to the file
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );
        // // for testing purposes
        // console.log(usersDB.users);
        console.log(result);
        res.status(201).json({ 'success': `New user ${email} created!`});
    } catch(err) {
        // Send error 500 code with error message
        res.status(500).json({ 'message': err.message})
    }
}   

module.exports = { handleNewUser };