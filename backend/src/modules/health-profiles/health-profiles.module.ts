import { Module } from '@nestjs/common';
import { HealthProfilesController } from './health-profiles.controller';
import { HealthProfilesService } from './health-profiles.service';

@Module({
  controllers: [HealthProfilesController],
  providers: [HealthProfilesService],
  exports: [HealthProfilesService],
})
export class HealthProfilesModule {}
