// server/middleware/upload.js
import multer from 'multer';

// Use memory storage for direct buffer feeding to Gemini Vision API
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf'
];

export const uploadCertificate = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 Megabytes max limit
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Allowed extensions: .pdf, .png, .jpg, .jpeg, .webp`
        ),
        false
      );
    }
  }
});
