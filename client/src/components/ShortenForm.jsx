import { useState } from "react";
import { shortenUrl } from "../utils/api";

export default function ShortenForm({ onResult }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await shortenUrl({ originalUrl, customAlias, expiresIn });
      onResult(res.data);
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresIn("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shorten-form">
      <h2>Shorten a URL</h2>

      <input
        type="url"
        placeholder="Paste your long URL here..."
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        required
      />

      <div className="optional-row">
        <input
          type="text"
          placeholder="Custom alias (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          maxLength={20}
        />
        <select value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)}>
          <option value="">Never expires</option>
          <option value="1">1 hour</option>
          <option value="24">24 hours</option>
          <option value="168">7 days</option>
          <option value="720">30 days</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Shortening..." : "Shorten URL →"}
      </button>
    </form>
  );
}
