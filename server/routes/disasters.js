import express from 'express';
import { createDisaster, getDisasters, updateDisaster, deleteDisaster } from '../controllers/disasters.js';
import { mockAuth } from '../utils/auth.js';

const router = express.Router();

// All routes use mock authentication
router.use(mockAuth);

// CRUD
router.post('/', createDisaster);
router.get('/', getDisasters);
router.put('/:id', updateDisaster);
router.delete('/:id', deleteDisaster);

export default router;
