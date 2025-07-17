// controllers/social.js
import { getMockSocialFeed, startMockSocialFeedEmitter } from '../utils/socialFeed.js';

// Returns the latest social feed posts
export async function getSocialFeed(req, res) {
  const posts = getMockSocialFeed();
  res.json(posts);
}

// Call this once at server startup to begin emitting new posts
export function startSocialFeedRealtime(io) {
  startMockSocialFeedEmitter(io);
}
