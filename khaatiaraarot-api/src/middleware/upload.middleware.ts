import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'INVALID_FILE_TYPE', 'Only JPEG, PNG, WebP, and GIF images are allowed'));
    }
  },
});

export function handleUpload(fieldName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    multerInstance.single(fieldName)(req, res, (err) => {
      if (!err) return next();
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError(400, 'FILE_TOO_LARGE', 'File size must not exceed 5MB'));
        }
        return next(new AppError(400, 'UPLOAD_ERROR', err.message));
      }
      next(err);
    });
  };
}
