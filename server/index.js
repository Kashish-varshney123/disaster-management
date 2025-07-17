import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import morgan from 'morgan';
import disasterRoutes from './routes/disasters.js';
import geocodeRoutes from './routes/geocode.js';
import socialRoutes from './routes/social.js';
import resourcesRoutes from './routes/resources.js';
import officialUpdatesRoutes from './routes/officialUpdates.js';
import rateLimit from 'express-rate-limit';
import { logAction } from './utils/logger.js';
import imageVerifyRoutes from './routes/imageVerify.js';
import { startSocialFeedRealtime } from './controllers/social.js';

// Load env vars

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

app.use(cors({
  origin: [/^http:\/\/localhost:\d+$/],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Attach io to req for routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/disasters', disasterRoutes);
app.use('/geocode', geocodeRoutes);
app.use('/social', socialRoutes);
app.use('/resources', resourcesRoutes);
const updatesLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  handler: (req, res) => {
    logAction(`Rate limit exceeded for /official-updates from IP: ${req.ip}`);
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
});

app.use('/official-updates', updatesLimiter, officialUpdatesRoutes);
app.use('/verify-image', imageVerifyRoutes);

app.get('/', (req, res) => {
  res.send('Disaster Response Backend running.');
});

const PORT = process.env.PORT || 5000;
// Start the mock social feed real-time emitter
startSocialFeedRealtime(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
