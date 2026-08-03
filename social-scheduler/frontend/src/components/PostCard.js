import React from "react";
import api from "../api/api";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace("/api", "");

const statusColors = {
  Draft: "#9ca3af",
  Scheduled: "#3b82f6",
  Posted: "#22c55e",
};

export default function PostCard({ post, onUpdated, onDeleted }) {
  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await api.put(`/posts/${post._id}`, { status: newStatus });
      onUpdated(data);
    } catch (err) {
      alert("Could not update status. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onDeleted(post._id);
    } catch (err) {
      alert("Could not delete post. Please try again.");
    }
  };

  return (
    <div className="post-card">
      {post.imagePath && (
        <img className="post-image" src={`${API_ORIGIN}${post.imagePath}`} alt={post.theme || "post preview"} />
      )}
      <div className="post-body">
        <span className="status-badge" style={{ backgroundColor: statusColors[post.status] }}>
          {post.status}
        </span>
        <p className="post-caption">{post.caption || <em>No caption yet</em>}</p>
        <p className="post-hashtags">{post.hashtags}</p>
        <p className="post-date">
          {new Date(post.scheduledDate).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <div className="post-actions">
          <select value={post.status} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Posted">Posted</option>
          </select>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
