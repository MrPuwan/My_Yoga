import { Module } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { cloudinaryProvider } from './cloudinary.provider';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadsController],
  providers: [cloudinaryProvider, UploadsService, RolesGuard],
})
export class UploadsModule {}
