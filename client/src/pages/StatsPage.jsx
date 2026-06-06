import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { getStats } from "../utils/api";

export default function StatsPage() {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats(code)
      .then((res) => setStats(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || "Could not load stats.")
      );
  }, [code]);

  if (error) return <div className="error-page">{error}</div>;
  if (!stats) return <div className="loading">Loading stats...</div>;

  return (
    <div className="stats-page">
      <h2>Analytics for <span>/{stats.shortCode}</span></h2>

      <div className="stats-meta">
        <div className="stat-box">
          <p className="stat-number">{stats.totalClicks}</p>
          <p className="stat-label">Total Clicks</p>
        </div>
        <div className="stat-box">
          <p className="stat-number">
            {new Date(stats.createdAt).toLocaleDateString()}
          </p>
          <p className="stat-label">Created On</p>
        </div>
        <div className="stat-box">
          <p className="stat-number">
            {stats.expiresAt
              ? new Date(stats.expiresAt).toLocaleDateString()
              : "Never"}
          </p>
          <p className="stat-label">Expires</p>
        </div>
      </div>

      <div className="original-url-box">
        <p>Original URL:</p>
        <a href={stats.originalUrl} target="_blank" rel="noreferrer">
          {stats.originalUrl}
        </a>
      </div>

      <h3>Clicks — Last 7 Days</h3>
      {stats.clicksByDay.length === 0 ? (
        <p className="no-data">No clicks recorded yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={stats.clicksByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
