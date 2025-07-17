// routes/social.js
import express from 'express';
import { getSocialFeed } from '../controllers/social.js';
import { mockAuth } from '../utils/auth.js';

const router = express.Router();

// Get the current social feed
router.get('/', mockAuth, getSocialFeed);

export default router;
