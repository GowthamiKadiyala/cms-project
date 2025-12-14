const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

// POST /api/contents (Create new content)
router.post("/", contentController.createContent);

// GET /api/contents/:typeId (Get all content of a specific type, e.g. all Blogs)
router.get("/:typeId", contentController.getContent);

module.exports = router;
