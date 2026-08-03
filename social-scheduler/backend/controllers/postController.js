const Post = require("../models/Post");

// @route POST /api/posts
// Create a new post (draft or scheduled), with optional uploaded image
exports.createPost = async (req, res) => {
  try {
    const { theme, caption, hashtags, scheduledDate, status } = req.body;

    if (!scheduledDate) {
      return res.status(400).json({ message: "Please provide a scheduled date" });
    }

    const post = await Post.create({
      user: req.userId,
      theme: theme || "",
      caption: caption || "",
      hashtags: hashtags || "",
      scheduledDate,
      status: status || "Draft",
      imagePath: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
};

// @route GET /api/posts
// Get all posts belonging to the logged-in user, sorted by scheduled date
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).sort({ scheduledDate: 1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
};

// @route PUT /api/posts/:id
// Update a post (e.g., change caption, date, or status)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.userId });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const fields = ["theme", "caption", "hashtags", "scheduledDate", "status"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) post[field] = req.body[field];
    });

    if (req.file) post.imagePath = `/uploads/${req.file.filename}`;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error updating post", error: err.message });
  }
};

// @route DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", error: err.message });
  }
};
