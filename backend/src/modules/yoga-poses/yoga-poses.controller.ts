import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { YogaPosesService } from './yoga-poses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateYogaPoseDto } from './dto/create-yoga-pose.dto';
import { UpdateYogaPoseDto } from './dto/update-yoga-pose.dto';
import { ListYogaPosesQueryDto } from './dto/list-yoga-poses-query.dto';

@Controller('yoga-poses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class YogaPosesController {
  constructor(private readonly yogaPosesService: YogaPosesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createYogaPoseDto: CreateYogaPoseDto) {
    return this.yogaPosesService.create(createYogaPoseDto);
  }

  @Get()
  findAll(@Query() query: ListYogaPosesQueryDto) {
    return this.yogaPosesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.yogaPosesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateYogaPoseDto: UpdateYogaPoseDto,
  ) {
    return this.yogaPosesService.update(id, updateYogaPoseDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.yogaPosesService.remove(id);
  }
}
