import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { memoryStorage } from 'multer';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadsService } from './uploads.service';

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('yoga-pose')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024, files: 1 },
      fileFilter: (_request, file, callback) => {
        if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
          callback(
            new BadRequestException(
              'Only JPG, PNG, and WebP images are allowed.',
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadYogaPoseImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'An image file is required in the "image" field.',
      );
    }
    if (!hasValidImageSignature(file)) {
      throw new BadRequestException(
        'The uploaded file content is not a valid JPG, PNG, or WebP image.',
      );
    }

    const secureUrl = await this.uploadsService.uploadYogaPoseImage(file);
    return { secureUrl };
  }
}

function hasValidImageSignature(file: Express.Multer.File): boolean {
  const bytes = file.buffer;

  if (file.mimetype === 'image/jpeg') {
    return (
      bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (file.mimetype === 'image/png') {
    const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return (
      bytes.length >= pngSignature.length &&
      pngSignature.every((byte, index) => bytes[index] === byte)
    );
  }

  if (file.mimetype === 'image/webp') {
    return (
      bytes.length >= 12 &&
      bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
      bytes.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }

  return false;
}
