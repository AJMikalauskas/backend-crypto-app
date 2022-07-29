const express = require('express');
const router = express.Router();
const refreshTokenController = require("../controllers/refreshTokenController");

// 1st param is the route and 2nd param is the handleRefreshToken method
router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;