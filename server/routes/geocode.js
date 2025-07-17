import express from 'express';
import { geocodeLocation } from '../controllers/geocode.js';
import { mockAuth } from '../utils/auth.js';

const router = express.Router();

router.use(mockAuth);
router.post('/', geocodeLocation);

export default router;
