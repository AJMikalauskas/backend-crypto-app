const express = require('express');
const router = express.Router();
const registerController = require("../controllers/registerController");

// 1st param is the route and 2nd param is the handleNewUser method
router.post('/', registerController.handleNewUser);

module.exports = router;