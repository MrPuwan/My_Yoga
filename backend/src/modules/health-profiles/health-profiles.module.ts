import { Module } from '@nestjs/common';
import { HealthProfilesController } from './health-profiles.controller';
import { HealthProfilesService } from './health-profiles.service';
import { PainAreasModule } from '../pain-areas/pain-areas.module';

@Module({
  imports: [PainAreasModule],
  controllers: [HealthProfilesController],
  providers: [HealthProfilesService],
  exports: [HealthProfilesService],
})
export class HealthProfilesModule {}
