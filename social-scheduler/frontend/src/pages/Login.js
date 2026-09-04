import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-wave"></div>
        <div className="auth-left-content">
          <p className="welcome-tag">Welcome back!</p>
          <h1>Good to see you Again!</h1>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h4>Analytics</h4>
                <p>Track real time performance</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div>
                <h4>Security</h4>
                <p>Enterprise grade protection</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h4>Speed</h4>
                <p>Super fast and reliable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <Link to="/signup" className="signup-pill">Sign Up</Link>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-icon-circle">🔒</div>
          <h2>Login to your account</h2>
          <p className="subtitle">Enter your credentials to continue</p>

          {error && <div className="error-box">{error}</div>}

          <label>Email Address</label>
          <div className="input-with-icon">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="input-with-icon">
            <span className="input-icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="form-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button type="button" className="forgot-link">Forgot password?</button>
          </div>

          <button type="submit" className="continue-btn" disabled={loading}>
            {loading ? "Logging in..." : "Continue"}
          </button>

          <div className="or-divider"><span>or</span></div>

          <button type="button" className="google-btn">
            <span className="google-icon">G</span> Continue with Google
          </button>

          <p className="help-text">
  Need help? <button type="button" className="link-btn">Contact admin</button>
</p>
        </form>
      </div>
    </div>
  );
}
