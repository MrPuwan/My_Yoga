import {
  BadGatewayException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.provider';

@Injectable()
export class UploadsService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinaryClient: typeof cloudinary,
  ) {}

  uploadYogaPoseImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinaryClient.uploader.upload_stream(
        {
          folder: 'yoga-poses',
          resource_type: 'image',
        },
        (error, result?: UploadApiResponse) => {
          if (error || !result?.secure_url) {
            reject(
              new BadGatewayException(
                'Image upload failed. Please try again.',
              ),
            );
            return;
          }
          resolve(result.secure_url);
        },
      );

      stream.end(file.buffer);
    });
  }
}
