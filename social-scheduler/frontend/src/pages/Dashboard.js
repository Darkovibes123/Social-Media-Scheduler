import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import CaptionGenerator from "../components/CaptionGenerator";
import UploadForm from "../components/UploadForm";
import Toast from "../components/Toast";
import CountUp from "../components/CountUp";
import DueReminder from "../components/DueReminder";
import "./Dashboard.css";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [prefill, setPrefill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(new Date());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recheck due posts every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);
    const duePosts = posts.filter(
    (p) => p.status === "Scheduled" && new Date(p.scheduledDate) <= now
  );
  console.log("Due posts check:", { now, posts, duePosts });
    return () => clearInterval(interval);
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
    setToast({ message: "Post saved successfully!", type: "success" });
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
    setToast({ message: "Post updated!", type: "success" });
  };

  const handlePostDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
    setToast({ message: "Post deleted.", type: "success" });
  };

  const handleMarkPosted = async (id) => {
    try {
      const { data } = await api.put(`/posts/${id}`, { status: "Posted" });
      handlePostUpdated(data);
    } catch (err) {
      setToast({ message: "Could not update post status.", type: "error" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const totalPosts = posts.length;
  const scheduledPosts = posts.filter((p) => p.status === "Scheduled").length;
  const publishedPosts = posts.filter((p) => p.status === "Posted").length;
  const draftPosts = posts.filter((p) => p.status === "Draft").length;

  const duePosts = posts.filter(
    (p) => p.status === "Scheduled" && new Date(p.scheduledDate) <= now
  );

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-dot"></span> SocialFlow
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => scrollToSection("dashboard")}
          >
            <span className="nav-icon">🏠</span> Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === "caption" ? "active" : ""}`}
            onClick={() => scrollToSection("caption")}
          >
            <span className="nav-icon">✨</span> Create Content
          </button>
          <button
            className={`nav-item ${activeSection === "calendar" ? "active" : ""}`}
            onClick={() => scrollToSection("calendar")}
          >
            <span className="nav-icon">📅</span> Calendar
          </button>
          <button
            className={`nav-item ${activeSection === "library" ? "active" : ""}`}
            onClick={() => scrollToSection("library")}
          >
            <span className="nav-icon">🗂️</span> Content Library
          </button>
        </nav>
        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">↩</span> Log Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar" id="dashboard">
          <div>
            <h1>Welcome back, {user?.name?.split(" ")[0] || "there"} 👋</h1>
            <p className="topbar-sub">Here's what's happening with your content today.</p>
          </div>
          <div className="topbar-right">
            <div className="avatar-circle">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <DueReminder duePosts={duePosts} onMarkPosted={handleMarkPosted} />

        <section className="stats-grid">
          <div className="stat-card fade-in" style={{ animationDelay: "0.05s" }}>
            <p className="stat-label">Total Posts</p>
            <h3><CountUp end={totalPosts} /></h3>
            <span className="stat-tag">All-time content</span>
          </div>
          <div className="stat-card fade-in" style={{ animationDelay: "0.15s" }}>
            <p className="stat-label">Scheduled</p>
            <h3><CountUp end={scheduledPosts} /></h3>
            <span className="stat-tag">Upcoming posts</span>
          </div>
          <div className="stat-card fade-in" style={{ animationDelay: "0.25s" }}>
            <p className="stat-label">Published</p>
            <h3><CountUp end={publishedPosts} /></h3>
            <span className="stat-tag">Live content</span>
          </div>
          <div className="stat-card fade-in" style={{ animationDelay: "0.35s" }}>
            <p className="stat-label">Drafts</p>
            <h3><CountUp end={draftPosts} /></h3>
            <span className="stat-tag">In progress</span>
          </div>
        </section>

        <section className="dashboard-section fade-in" id="caption" style={{ animationDelay: "0.4s" }}>
          <h2>AI Caption Generator</h2>
          <CaptionGenerator onSelectCaption={setPrefill} />
        </section>

        <section className="dashboard-section fade-in" id="library" style={{ animationDelay: "0.5s" }}>
          <h2>Create / Schedule a Post</h2>
          <UploadForm prefill={prefill} onPostCreated={handlePostCreated} />
        </section>

        <section className="dashboard-section fade-in" id="calendar" style={{ animationDelay: "0.6s" }}>
          <h2>Your Content Calendar</h2>
          {loading ? (
            <p className="loading-text">Loading posts...</p>
          ) : (
            <Calendar posts={posts} onUpdated={handlePostUpdated} onDeleted={handlePostDeleted} />
          )}
        </section>
        console.log("Due posts check:", { now, posts, duePosts });

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </div>
  );
}