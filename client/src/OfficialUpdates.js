import React, { useEffect, useState } from "react";

export default function OfficialUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/official-updates`)
      .then((res) => res.json())
      .then((data) => setUpdates(data))
      .catch((err) => setError("Failed to fetch updates"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 16 }}>
      <h2>ReliefWeb</h2>
      {loading && <div>Loading updates...</div>}
      {updates.length === 0 && !loading && (
        <div style={{ color: "red", margin: "1rem 0" }}>{error || "No updates found."}</div>
      )}
      {updates.filter(u => u.source === "ReliefWeb" && !u.title.startsWith("Failed")).map((u, i) => (
        <div key={i} style={{ margin: "1.5rem 0" }}>
          <b>ReliefWeb:</b> <a href={u.link} target="_blank" rel="noopener noreferrer">{u.title}</a>
          <div style={{ fontSize: 14, color: "#444" }}>{u.pubDate && new Date(u.pubDate).toLocaleString()}</div>
          <div style={{ margin: "0.5rem 0 0 0", color: "#333" }}
            dangerouslySetInnerHTML={{ __html: u.description?.slice(0, 500) + (u.description?.length > 500 ? "..." : "") }} />
        </div>
      ))}
    </div>
  );
}
