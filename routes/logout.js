const express = require('express');
const router = express.Router();
const logoutController = require("../controllers/logoutController");

// 1st param is the route and 2nd param is the handleLogout method
router.get('/', logoutController.handleLogout);

module.exports = router;