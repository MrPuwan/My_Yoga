import { BadRequestException } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

describe('UploadsController', () => {
  const uploadsService = {
    uploadYogaPoseImage: jest.fn(),
  };
  const controller = new UploadsController(
    uploadsService as unknown as UploadsService,
  );

  beforeEach(() => jest.clearAllMocks());

  it('rejects a missing image', async () => {
    await expect(controller.uploadYogaPoseImage()).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects an invalid image signature', async () => {
    const file = {
      mimetype: 'image/png',
      buffer: Buffer.from('not an image'),
    } as Express.Multer.File;

    await expect(controller.uploadYogaPoseImage(file)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(uploadsService.uploadYogaPoseImage).not.toHaveBeenCalled();
  });

  it('returns the secure URL for a valid image', async () => {
    const file = {
      mimetype: 'image/jpeg',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0x00]),
    } as Express.Multer.File;
    uploadsService.uploadYogaPoseImage.mockResolvedValue(
      'https://res.cloudinary.com/demo/image/upload/yoga-poses/pose.jpg',
    );

    await expect(controller.uploadYogaPoseImage(file)).resolves.toEqual({
      secureUrl:
        'https://res.cloudinary.com/demo/image/upload/yoga-poses/pose.jpg',
    });
  });
});
