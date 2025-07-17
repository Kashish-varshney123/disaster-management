# 🚨 Disaster Management MERN Platform

A comprehensive, full-stack MERN application for real-time disaster response, resource coordination, and emergency management. Features modern UI/UX, geospatial intelligence, social feeds, official updates, and AI-powered image forensics with Google Gemini integration.

---

## 🏆 Platform Overview
- **Frontend:** React, React-Leaflet, modern CSS
- **Backend:** Node.js, Express, Supabase (Postgres + PostGIS)
- **AI Integration:** Google Gemini Vision API for image authenticity
- **Real-time:** (Optional) Socket.IO for live updates

---

## 🎯 Features

### 🗺️ Disaster Resource Map
- Interactive map for adding, viewing, and searching disaster resources (shelters, supplies, medical, rescue, etc.)
- Geospatial queries for proximity search
- Modern, visually appealing map UI

### 📢 Social Feed
- Real-time, user-generated disaster reports, requests, and offers
- Post, search, and filter community updates
- Soft pastel card UI for readability

### 📰 Official Updates
- Aggregation of trusted, official updates (manual or via API)
- Highlighted, visually distinct section for authority communications

### ✅ Image Verification (AI-powered)
- Upload images for authenticity verification using Google Gemini Vision
- AI verdict and explanation for digital manipulation or deepfake detection
- User-friendly colored alert boxes for errors (API overload, etc.)

### 🎨 UI/UX Highlights
- Disaster-themed color palette (navy, blue, orange, pastel backgrounds)
- Animated, responsive cards and buttons
- Accessible, modern design with clear feedback

---

## 🛠️ Tech Stack
- **Frontend:** React, React-Leaflet, CSS
- **Backend:** Node.js, Express
- **Database:** Supabase (PostgreSQL + PostGIS)
- **AI:** Google Gemini API (image forensics)
- **Other:** Multer (file uploads), dotenv, (optional: Socket.IO)

---

## ⚡ Quick Start

### 1. Clone the Repo
```sh
git clone https://github.com/Kashish-varshney123/Disaster-Management-.git
cd Disaster-Management-
```

### 2. Install Dependencies
```sh
cd server && npm install
cd ../client && npm install
```

### 3. Environment Variables
Create a `.env` file in `server/` with:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key (optional)
```
**Never commit your `.env` to public repos!**

### 4. Run the App
- **Backend:**
  ```sh
  cd server
  npm start
  # or for dev: npm run dev
  ```
- **Frontend:**
  ```sh
  cd client
  npm start
  ```
- Visit [http://localhost:3000](http://localhost:3000)

---

## 🔍 Gemini AI Image Verification
- Uses Google Gemini Vision API (`gemini-1.5-flash`) for forensic image analysis
- Handles API errors and overloads with user-friendly, colored alert boxes
- Requires a valid Gemini API key from [Google AI Studio](https://ai.google.dev/)

---

## 📂 Project Structure
```
Disaster-Management-
├── client/      # React frontend
├── server/      # Node/Express backend
├── uploads/     # (server-side, for image verification)
└── README.md
```

---

## 🚀 Deployment
- **Local:** Run both frontend and backend as above
- **Production:** Deploy backend (Node.js/Express) and frontend (React build) to your favorite cloud provider (Render, Vercel, etc.)
- **Environment:** Set all required variables in production environment

---

## 🤝 Contributing
1. Fork the repo & create a feature branch
2. Make changes (see code style in existing files)
3. Open a Pull Request with clear description

---

## 🎯 Roadmap
- [x] Core disaster management & resource mapping
- [x] Social feed and official updates
- [x] Gemini AI-powered image verification
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Push notifications

---

## 📄 License
This project is for educational and humanitarian purposes. See [LICENSE](LICENSE) for details.
- Disaster CRUD (title, location, description, tags)
- Ownership & audit trails
- Real-time updates

---

*Generated with Windsurf Cascade AI*
