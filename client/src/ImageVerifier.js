import React, { useState } from "react";
import API_URL from "./config";

export default function ImageVerifier() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(API_URL +"/verify-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        setResult(data);
      } else {
        setError(data.message || "Verification failed.");
      }
    } catch (err) {
      console.error("Image verification error:", err);
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 10 }}>
      <h2>Image Verification</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file || loading} style={{ marginLeft: 12 }}>
          {loading ? "Verifying..." : "Verify Image"}
        </button>
      </form>
      {error && (
        <div style={{
          background: '#ffeaea',
          color: '#c62828',
          border: '1.5px solid #ffb3b3',
          borderRadius: 9,
          padding: '14px 18px',
          marginTop: 20,
          fontWeight: 500,
          fontSize: 17,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 2px 8px 0 rgba(198,40,40,0.08)'
        }}>
          <span role="img" aria-label="warning" style={{fontSize:22}}>⚠️</span>
          <span>
            {error.includes("overloaded") || error.includes("503")
              ? "The AI service is temporarily overloaded. Please try again in a few minutes."
              : error}
          </span>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 24, padding: 16, background: "#f9f9f9", borderRadius: 8 }}>
          <b>Verdict:</b> {result.verdict}
          <div style={{ marginTop: 8 }}>{result.explanation}</div>
        </div>
      )}
    </div>
  );
}
