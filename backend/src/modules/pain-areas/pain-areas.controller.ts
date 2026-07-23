import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePainAreaDto } from './dto/create-pain-area.dto';
import { PainAreasService } from './pain-areas.service';

@Controller('pain-areas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PainAreasController {
  constructor(private readonly painAreasService: PainAreasService) {}

  @Get()
  findAll() {
    return this.painAreasService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreatePainAreaDto) {
    return this.painAreasService.create(dto);
  }
}
