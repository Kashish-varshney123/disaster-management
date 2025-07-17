import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyImageGemini } from '../controllers/imageVerify.js';

// Store uploaded files to disk for fs.readFileSync compatibility
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

const router = express.Router();

router.post('/', upload.single('image'), verifyImageGemini);

export default router;
