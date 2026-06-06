import { useState } from "react";

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-card">
      <p className="label">Your short link is ready!</p>
      <div className="short-url-row">
        <a href={result.shortUrl} target="_blank" rel="noreferrer">
          {result.shortUrl}
        </a>
        <button onClick={handleCopy} className="copy-btn">
          {copied ? "✅ Copied!" : "Copy"}
        </button>
      </div>
      <p className="original-url">↳ {result.originalUrl}</p>
      {result.expiresAt && (
        <p className="expires">
          Expires: {new Date(result.expiresAt).toLocaleString()}
        </p>
      )}
      <a href={`/stats/${result.shortCode}`} className="stats-link">
        View Analytics →
      </a>
    </div>
  );
}
