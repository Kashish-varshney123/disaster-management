import express from 'express';
import { getOfficialUpdates } from '../controllers/officialUpdates.js';

const router = express.Router();

router.get('/', getOfficialUpdates);

export default router;
