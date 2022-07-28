const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

// 1st param is the route and 2nd param is the handleLogin method
router.post('/', authController.handleLogin);

module.exports = router;