const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { generateCaption } = require("../controllers/aiController");

router.post("/generate-caption", protect, generateCaption);

module.exports = router;
