import express from 'express';
import { createResource, getNearbyResources } from '../controllers/resources.js';
import mockAuth from '../middleware/mockAuth.js';

const router = express.Router();

router.post('/', mockAuth, createResource);
router.get('/nearby', getNearbyResources);

export default router;
