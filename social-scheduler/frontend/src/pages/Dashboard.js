import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import CaptionGenerator from "../components/CaptionGenerator";
import UploadForm from "../components/UploadForm";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [prefill, setPrefill] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [...prev, newPost]);
    setPrefill(null);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Social Media Scheduler</h1>
        <div className="header-right">
          <span>Hi, {user?.name}</span>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      <section className="dashboard-section">
        <CaptionGenerator onSelectCaption={setPrefill} />
      </section>

      <section className="dashboard-section">
        <UploadForm prefill={prefill} onPostCreated={handlePostCreated} />
      </section>

      <section className="dashboard-section">
        <h3>Your Content Calendar</h3>
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <Calendar posts={posts} onUpdated={handlePostUpdated} onDeleted={handlePostDeleted} />
        )}
      </section>
    </div>
  );
}
