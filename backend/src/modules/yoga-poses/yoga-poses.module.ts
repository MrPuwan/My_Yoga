import { Module } from '@nestjs/common';
import { YogaPosesController } from './yoga-poses.controller';
import { YogaPosesService } from './yoga-poses.service';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  controllers: [YogaPosesController],
  providers: [YogaPosesService, RolesGuard],
  exports: [YogaPosesService],
})
export class YogaPosesModule {}
