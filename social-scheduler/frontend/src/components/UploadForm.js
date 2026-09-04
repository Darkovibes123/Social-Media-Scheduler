import React, { useState, useEffect } from "react";
import api from "../api/api";

export default function UploadForm({ prefill, onPostCreated }) {
  const [image, setImage] = useState(null);
  const [theme, setTheme] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-fill caption fields when the user picks an AI-generated option
  useEffect(() => {
    if (prefill) {
      setTheme(prefill.theme || "");
      setCaption(prefill.caption || "");
      setHashtags(prefill.hashtags || "");
    }
  }, [prefill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledDate) {
      setError("Please choose a date and time to schedule this post.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      formData.append("theme", theme);
      formData.append("caption", caption);
      formData.append("hashtags", hashtags);
      formData.append("scheduledDate", scheduledDate);
      formData.append("status", status);

      const { data } = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPostCreated(data);
      // reset form
      setImage(null);
      setTheme("");
      setCaption("");
      setHashtags("");
      setScheduledDate("");
      setStatus("Draft");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      {error && <div className="error-box">{error}</div>}

      <label>Media (image or video)</label>
      <input type="file" accept="image/*,video/mp4" onChange={(e) => setImage(e.target.files[0])} />

      <label>Theme / Keyword</label>
      <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. campus event" />

      <label>Caption</label>
      <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} />

      <label>Hashtags</label>
      <input type="text" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />

      <label>Scheduled Date & Time</label>
      <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required />

      <label>Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Draft">Draft</option>
        <option value="Scheduled">Scheduled</option>
        <option value="Posted">Posted</option>
      </select>

      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Post"}</button>
    </form>
  );
}