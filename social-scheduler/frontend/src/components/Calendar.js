import React from "react";
import PostCard from "./PostCard";

export default function Calendar({ posts, onUpdated, onDeleted }) {
  if (!posts.length) {
    return <p className="empty-state">No posts yet. Create your first scheduled post below!</p>;
  }

  // Group posts by date (YYYY-MM-DD) for a simple calendar-style layout
  const grouped = posts.reduce((acc, post) => {
    const dateKey = new Date(post.scheduledDate).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(post);
    return acc;
  }, {});

  return (
    <div className="calendar-grid">
      {Object.entries(grouped).map(([date, datePosts]) => (
        <div key={date} className="calendar-day">
          <h4>{date}</h4>
          <div className="calendar-day-posts">
            {datePosts.map((post) => (
              <PostCard key={post._id} post={post} onUpdated={onUpdated} onDeleted={onDeleted} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
