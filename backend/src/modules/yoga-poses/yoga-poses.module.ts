import { Module } from '@nestjs/common';
import { YogaPosesController } from './yoga-poses.controller';
import { YogaPosesService } from './yoga-poses.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PainAreasModule } from '../pain-areas/pain-areas.module';

@Module({
  imports: [PainAreasModule],
  controllers: [YogaPosesController],
  providers: [YogaPosesService, RolesGuard],
  exports: [YogaPosesService],
})
export class YogaPosesModule {}
