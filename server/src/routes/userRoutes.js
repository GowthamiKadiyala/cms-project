const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// When someone visits GET /, run the controller logic
router.get("/", userController.getUsers);

module.exports = router;
