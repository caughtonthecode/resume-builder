import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  createResume,
  deleteResume,
  getResumeById,
  getUserResumes,
  updateResume,
} from '../controllers/resumeController';
import { uploadResumeImages } from '../controllers/uploadImages';

const resumeRouter = express.Router();

resumeRouter.post('/', protect, createResume);
resumeRouter.get('/', protect, getUserResumes);
resumeRouter.get('/:id', protect, getResumeById);

resumeRouter.put('/:id', protect, updateResume);
resumeRouter.put('/:id', protect, uploadResumeImages);

resumeRouter.delete('/:id', protect, deleteResume);

export default resumeRouter;
