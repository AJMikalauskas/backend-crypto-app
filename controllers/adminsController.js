
// will end up hooking this up to MongoDB, but this is the dummy data for now
// const data = {
//     users: require("../model/users.json"),
//     setUsers: function (data) { this.users = data }
// }
//MongoDB Schema connection
const Admin = require('../model/Admin');

// Logic not fully complete for all CRUD operations yet...
const getAllUsers = async (req,res) => {
    // Finds all since no specification is in the find()
    const admins = await Admin.find();
    if(!admins) return res.status(204).json({'message': 'No Admins found.'});
    res.json(admins);
}

const createNewUser = (req,res) => {
    const newUser = {
        // the or statement is for the original user becuase you cannot pull from previous user at start since none exist
        id: data.users?.length ? data.users[data.users.length - 1].id + 1 : 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    }
    // Makes sure all fields or properties aren't null
    if(!newUser.firstname || !newUser.lastname || !newUser.email || !newUser.password) {
        return res.status(400).json({ 'message': ' All Fields Are Required. '});
    }
    // adds new user using spread operator.
    data.setUsers([...data.users, newUser])
    res.status(201).json(data.users);
}

const updateUser = (req,res) => {
    const user = data.users.find(usr => usr.id === parseInt(req.body.id));
    if(!user) {
        return res.status(400).json({ 'message' : `User ID ${req.body.id} not found`})
    }
    // if thes fields exist, changes them to what the updates user should be.
    if (req.body.firstname) user.firstname = req.body.firstname;
    if (req.body.lastname) user.lastname = req.body.lastname;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    //filters out the old data of the user and creates unsorted array with the new updated user
    const filteredArray = data.users.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, user];
    // Creates a sorted array of users based on numerical order of their ids.
    data.setUsers(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.users);
}

const deleteUser = (req,res) => {
    // finds user with id passed into body
    const user = data.users.find(usr => usr.id === parseInt(req.body.id));
    // if user already doesn't exists, results in error, can't delete non-existent user 
    if(!user) {
        return res.status(400).json({ 'message' : `User ID ${req.body.id} not found`})
    }
    // Tests are doen and now creates a new filteredArray of users without the to be deleted user and then calls setUsers() to the filteredArray
    const filteredArray = data.users.filter(usr => usr.id !== parseInt(req.body.id));
    data.setUsers([...filteredArray])
    res.json(data.users)
}

// will come from url, like a query string and will mainly only be used here in node backend
const getUser = (req,res) => {
    // Finds users by .find() and id; if not existent will reutrn 400 error, else returns user.
    const user = data.users.find(usr => usr.id === parseInt(req.params.id));
    if(!user) {
        return res.status(400).json({ 'message' : `User ID ${req.params.id} not found`})
    }
    res.json(user);
}

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser, getUser };