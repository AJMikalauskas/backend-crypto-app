const express = require('express');
const router = express.Router();
const adminsController = require('../../controllers/adminsController')
//const verifyJWT = require("../../middleware/verifyJWT");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.route('/')
    .get(adminsController.getAllAdmins)
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor)
    .post(adminsController.createNewAdmin)
    .put(adminsController.updateAdmin)
    // verifyRoles(ROLES_LIST.Admin)
    .delete(adminsController.deleteAdmin);
router.route('/:id')
    .get(adminsController.getAdmin);

module.exports = router;