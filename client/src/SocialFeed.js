import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import API_URL from "./config";

const socket = io(API_URL);

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [type, setType] = useState("all");
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    // Fetch initial feed
    fetch(API_URL + "/social", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPosts(data));

    // Listen for real-time updates
    socket.on("social_post", post => {
      setPosts(prev => [post, ...prev]);
    });

    return () => socket.off("social_post");
  }, []);

  // Filtering logic
  const filtered = posts.filter(post =>
    (type === "all" || post.type === type) &&
    (post.text.toLowerCase().includes(filter.toLowerCase()) ||
     post.user.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div style={{
      maxWidth: 600,
      margin: '2rem auto',
      background: '#e3f0ff',
      borderRadius: 16,
      boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
      padding: 20,
      minWidth: 280
    }}>
      <h2 style={{ fontSize: 22, marginTop: 0, marginBottom: 16, textAlign: 'center', color: '#1976d2', fontWeight: 800 }}>Real-Time Social Feed</h2>
      <form onSubmit={e => {
        e.preventDefault();
        if (!newMsg.trim()) return;
        // Add new post to feed (mocked client-side only)
        setPosts(prev => [{
          id: Date.now(),
          user: "You",
          type: "alert",
          text: newMsg,
          timestamp: Date.now()
        }, ...prev]);
        setNewMsg("");
      }} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Type a new report..."
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Post</button>
      </form>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Search text/user..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="all">All</option>
          <option value="need">Need</option>
          <option value="offer">Offer</option>
          <option value="alert">Alert</option>
        </select>
      </div>
      <ul>
        {filtered.map(post => {
          // Priority alert keywords
          // Keyword-based classifier
          const priorityClassifier = [
            { level: "critical", keywords: ["urgent", "sos", "emergency", "life-threatening", "immediate danger"] },
            { level: "high", keywords: ["help!", "need immediate", "trapped", "injured", "fire", "collapse"] },
            { level: "medium", keywords: ["need", "request", "assistance", "missing", "lost"] },
            { level: "low", keywords: [] }
          ];
          let priority = "low";
          let badge = null;
          for (const group of priorityClassifier) {
            if (group.keywords.some(kw => post.text.toLowerCase().includes(kw))) {
              priority = group.level;
              break;
            }
          }
          if (priority === "critical") badge = <span style={{ color: "#fff", background: "#d32f2f", padding: "2px 8px", borderRadius: 4, marginLeft: 8, fontWeight: 600, fontSize: 13 }}>CRITICAL</span>;
          else if (priority === "high") badge = <span style={{ color: "#fff", background: "#f57c00", padding: "2px 8px", borderRadius: 4, marginLeft: 8, fontWeight: 600, fontSize: 13 }}>HIGH</span>;
          else if (priority === "medium") badge = <span style={{ color: "#fff", background: "#1976d2", padding: "2px 8px", borderRadius: 4, marginLeft: 8, fontWeight: 600, fontSize: 13 }}>MEDIUM</span>;
          // Optionally: light background for critical/high
          const bg = priority === "critical" ? "#ffeaea" : priority === "high" ? "#fff6e0" : undefined;
          return (
            <li key={post.id} style={{
              marginBottom: 12,
              borderBottom: "1px solid #eee",
              background: bg
            }}>
              <b>{post.user}</b> <span style={{ color: "#888" }}>({post.type})</span>
              {badge}
              <div>{post.text}</div>
              <small>{new Date(post.timestamp).toLocaleString()}</small>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
