const express = require("express");
const router = express.Router();
const contentTypeController = require("../controllers/contentTypeController");

router.post("/", contentTypeController.createType); // POST /api/types
router.get("/", contentTypeController.getTypes); // GET /api/types

module.exports = router;
