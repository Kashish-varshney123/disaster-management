import React, { useState } from 'react';
import './App.css';
import SocialFeed from "./SocialFeed";
import ResourceMap from "./ResourceMap";
import OfficialUpdates from "./OfficialUpdates";
import ImageVerifier from "./ImageVerifier";
import API_URL from "./config";


function App() {
  const [page, setPage] = useState('dashboard');
  console.log("Connecting socket.io to:", API_URL);
  //console.log("Connecting socket.io to:", API_URL);
  return (
    <div className="App" style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setPage("dashboard")}
          className={page === "dashboard" ? "active" : ""}
        >
          Dashboard
        </button>
        <button
          onClick={() => setPage("official")}
          className={page === "official" ? "active" : ""}
        >
          Official Updates
        </button>
        <button
          onClick={() => setPage("image")}
          className={page === "image" ? "active" : ""}
        >
          Image Verification
        </button>
        <button
          onClick={() => setPage("social")}
          className={page === "social" ? "active" : ""}
        >
          Social Feed
        </button>
      </div>
      {page === "dashboard" && (
        <>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 900,
            minHeight: 280,
            margin: '0 auto 32px auto',
            borderRadius: 32,
            overflow: 'hidden',
            boxShadow: '0 8px 36px 0 rgba(25, 118, 210, 0.18)',
          }}>
            <img
              src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80"
              alt="Disaster response scene"
              style={{
                width: '100%',
                height: '100%',
                minHeight: 280,
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                filter: 'brightness(0.65) saturate(1.1)'
              }}
            />
            {/* Dark overlay for readability */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(90deg, rgba(30,30,30,0.35) 0%, rgba(25,118,210,0.13) 100%)',
              zIndex: 2
            }} />
            {/* Optional: Place any dashboard title or icon here if needed */}
            <div style={{ position: 'relative', zIndex: 3 }}></div>
          </div>
          <h1 style={{
            textAlign: 'center',
            fontSize: 38,
            fontWeight: 900,
            color: '#1976d2',
            letterSpacing: 1.5,
            marginBottom: 0
          }}>
            Disaster Resource Map
          </h1>
          <div style={{
            width: 120,
            height: 6,
            background: 'linear-gradient(90deg, #ff9800 0%, #1976d2 100%)',
            borderRadius: 6,
            margin: '12px auto 36px auto',
            boxShadow: '0 2px 8px 0 rgba(255,152,0,0.14)'
          }} />
          <ResourceMap />
          <hr style={{ margin: '3rem 0' }} />
        </>
      )}
      {page === "official" && <OfficialUpdates />}
      {page === "image" && <ImageVerifier />}
      {page === "social" && <SocialFeed />}
    </div>
  );
}

export default App;