const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imagePath: { type: String, default: "" }, // path to uploaded media file
    theme: { type: String, default: "" }, // keyword/theme used for AI caption
    caption: { type: String, default: "" }, // final chosen caption
    hashtags: { type: String, default: "" }, // final chosen hashtags
    scheduledDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Draft", "Scheduled", "Posted"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
