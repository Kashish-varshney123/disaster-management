// src/config.js
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://disaster-management-5nzm.onrender.com"
    : "http://localhost:5000";
export default API_URL;
