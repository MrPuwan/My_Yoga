import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { HealthProfilesService } from './health-profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateHealthProfileDto } from './dto/create-health-profile.dto';
import { UpdateHealthProfileDto } from './dto/update-health-profile.dto';

@Controller('health-profile')
@UseGuards(JwtAuthGuard)
export class HealthProfilesController {
  constructor(private readonly healthProfilesService: HealthProfilesService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createHealthProfileDto: CreateHealthProfileDto,
  ) {
    return this.healthProfilesService.create(userId, createHealthProfileDto);
  }

  @Get('me')
  findMine(@CurrentUser('id') userId: string) {
    return this.healthProfilesService.findByUserId(userId);
  }

  @Put()
  update(
    @CurrentUser('id') userId: string,
    @Body() updateHealthProfileDto: UpdateHealthProfileDto,
  ) {
    return this.healthProfilesService.update(userId, updateHealthProfileDto);
  }
}
