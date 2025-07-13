import fs from 'fs';
import path from 'path';

import Resume from '../models/resumeModel.js';
import upload from './../middleware/uploadMiddleware.js';
import { error } from 'console';

export const uploadResumeImages = async (req, res) => {
  try {
    // MULTER CONFIGURATION
    upload.fields([{ name: 'thumbnail' }, { name: 'profileImage' }])(
      req,
      res,
      async (err) => {
        if (err) {
          return res
            .status(400)
            .json({ message: 'File upload failed', error: error.message });
        }

        const resumeId = req.params.id;
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: req.user._id,
        });

        if (!resume) {
          return res.status(404).json({
            message: 'Resume not found or unauthorized',
          });
        }
        // USE PROCESS CWD TO LOCATE UPLOAD FOLDER
        const uploadsFolder = path.join(process.cwd(), 'uploads');
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const newThumbnail = req.files.thumbnail?.[0];
        const newProfileImage = req.files.newProfileImage?.[0];

        // THUMBNAIL
        if (newThumbnail) {
          if (resume.thumbnailLink) {
            const oldThumbnail = path.join(
              uploadsFolder,
              path.basename(resume.thumbnailLink)
            );
            if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
          }
          resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
        }

        // PROFILEIMAGE
        if (newProfileImage) {
          if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
              uploadsFolder,
              path.basename(resume.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
          }
          resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
        }

        await resume.save();
        res.status(200).json({
          message: 'Image uploaded successfully',
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
      }
    );
  } catch (error) {
    console.log('error uploading image:', err);
    res.status(500).json({
      message: 'Failed to uploads images',
      error: err.message,
    });
  }
};
