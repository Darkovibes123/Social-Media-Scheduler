const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.post("/", protect, upload.single("image"), createPost);
router.get("/", protect, getPosts);
router.put("/:id", protect, upload.single("image"), updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
