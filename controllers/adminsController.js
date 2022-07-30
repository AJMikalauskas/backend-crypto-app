
// will end up hooking this up to MongoDB, but this is the dummy data for now
// const data = {
//     users: require("../model/users.json"),
//     setUsers: function (data) { this.users = data }
// }
//MongoDB Schema connection
const Admin = require('../model/Admin');

// Logic not fully complete for all CRUD operations yet...
const getAllAdmins = async (req,res) => {
    // Finds all since no specification is in the find()
    const admins = await Admin.find();
    // if None exists return message that none exist, elese return found admins in response JSON.
    if(!admins) return res.status(204).json({'message': 'No Admins found.'});
    res.json(admins);
}

const createNewAdmin = async (req,res) => {
    // Makes sure all fields or properties aren't null, enhances by optional chaining(?.)
    if(!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': ' All Fields Are Required. '});
    }
    try {
        // Creates new document in specified collection in the Admin.js Model
        const result = await Admin.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result);
    } catch(err) {
        console.log(err);
    }
}

const updateAdmin = async (req,res) => {
    // id required for changing which specific admin
    if(!req?.body?.id) {
        return res.status(400).json({'message': 'ID parameter is required.'})
    }

    // MongoDB auto generates an _id field,; can use .findOne() method based on the _id property set equal to the req.body.id 
    const admin = await Admin.findOne({ _id: req.body.id }).exec();
    if(!admin) {
        return res.status(204).json({ 'message' : `No admin matches ID ${req.body.id}`})
    }

    // if thes fields exist, changes them to what the updates admin should be.
    if (req.body?.firstname) admin.firstname = req.body.firstname;
    if (req.body?.lastname) admin.lastname = req.body.lastname;

    // save admin to collection
    const result = await admin.save();
    res.json(result);

    // //filters out the old data of the user and creates unsorted array with the new updated user
    // const filteredArray = data.users.filter(emp => emp.id !== parseInt(req.body.id));
    // const unsortedArray = [...filteredArray, user];
    // // Creates a sorted array of users based on numerical order of their ids.
    // data.setUsers(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
}

const deleteAdmin = async (req,res) => {
    // id required for deleting which specific admin
    if(!req?.body?.id) {
        return res.status(400).json({'message': 'Admin ID is required.'})
    }

    // MongoDB auto generates an _id field,; can use .findOne() method based on the _id property set equal to the req.body.id 
    const admin = await Admin.findOne({ _id: req.body.id }).exec();
    if(!admin) {
        return res.status(204).json({ 'message' : `No admin matches ID ${req.body.id}`})
    }
    const result = await admin.deleteOne({ _id: req.body.id});
    res.json(result);
    // // Tests are doen and now creates a new filteredArray of users without the to be deleted user and then calls setUsers() to the filteredArray
    // const filteredArray = data.users.filter(usr => usr.id !== parseInt(req.body.id));
    // data.setUsers([...filteredArray])
}

// will come from url, like a query string and will mainly only be used here in node backend
const getAdmin = async (req,res) => {
    // id required for deleting which specific admin
    if(!req?.params?.id) {
        return res.status(400).json({'message': 'Admin ID is required.'})
    }

    // MongoDB auto generates an _id field,; can use .findOne() method based on the _id property set equal to the req.params.id 
    const admin = await Admin.findOne({ _id: req.params.id }).exec();
    if(!admin) {
        return res.status(204).json({ 'message' : `No admin matches ID ${req.params.id}`})
    }

    res.json(admin);
}

module.exports = { getAllAdmins, createNewAdmin, updateAdmin, deleteAdmin, getAdmin };