import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const productCoverMulterConfig: MulterOptions = {
  fileFilter: (_, file, cb) => {
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
      return cb(new BadRequestException('Invalid file type'), false);
    }
    cb(null, true);
  },
  storage: memoryStorage(),
};
