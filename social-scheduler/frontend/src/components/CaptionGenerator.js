import React, { useState } from "react";
import api from "../api/api";

export default function CaptionGenerator({ onSelectCaption }) {
  const [theme, setTheme] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!theme.trim()) return;
    setLoading(true);
    setError("");
    setOptions([]);
    try {
      const { data } = await api.post("/ai/generate-caption", { theme });
      setOptions(data.options || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate captions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="caption-generator">
      <h3>AI Caption Generator</h3>
      <form onSubmit={handleGenerate} className="caption-form">
        <input
          type="text"
          placeholder='e.g. "pageant evening gown look"'
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Captions"}
        </button>
      </form>
      {error && <div className="error-box">{error}</div>}
      <div className="caption-options">
        {options.map((opt, idx) => (
          <div key={idx} className="caption-option">
            <p className="caption-text">{opt.caption}</p>
            <p className="hashtags-text">{opt.hashtags}</p>
            <button
              type="button"
              className="use-caption-btn"
              onClick={() => onSelectCaption({ theme, caption: opt.caption, hashtags: opt.hashtags })}
            >
              Use this one
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
