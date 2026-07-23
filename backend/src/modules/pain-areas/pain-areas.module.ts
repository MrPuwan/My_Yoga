import { Module } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PainAreasController } from './pain-areas.controller';
import { PainAreasService } from './pain-areas.service';

@Module({
  controllers: [PainAreasController],
  providers: [PainAreasService, RolesGuard],
  exports: [PainAreasService],
})
export class PainAreasModule {}
