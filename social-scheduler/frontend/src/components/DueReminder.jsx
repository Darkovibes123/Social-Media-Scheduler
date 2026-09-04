import React from "react";
import "./DueReminder.css";

export default function DueReminder({ duePosts, onMarkPosted }) {
  if (!duePosts.length) return null;

  return (
    <div className="due-reminder">
      <div className="due-reminder-header">
        <span className="due-bell">🔔</span>
        <h3>
          {duePosts.length} post{duePosts.length > 1 ? "s" : ""} due right now!
        </h3>
      </div>
      <div className="due-list">
        {duePosts.map((post) => (
          <div key={post._id} className="due-item">
            <div className="due-item-text">
              <p className="due-caption">
                {post.caption ? post.caption.slice(0, 70) : "Untitled post"}
                {post.caption && post.caption.length > 70 ? "..." : ""}
              </p>
              <p className="due-time">
                Was due: {new Date(post.scheduledDate).toLocaleString()}
              </p>
            </div>
            <button className="mark-posted-btn" onClick={() => onMarkPosted(post._id)}>
              Mark as Posted
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}