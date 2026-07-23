import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHealthProfileDto } from './dto/create-health-profile.dto';
import { UpdateHealthProfileDto } from './dto/update-health-profile.dto';
import { PainAreasService } from '../pain-areas/pain-areas.service';

@Injectable()
export class HealthProfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly painAreasService: PainAreasService,
  ) {}

  async create(userId: string, dto: CreateHealthProfileDto) {
    await this.painAreasService.ensureValid([dto.painArea]);
    const existingProfile = await this.prisma.healthProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('Health profile already exists');
    }

    const bmi = this.calculateBmi(dto.height, dto.weight);

    return this.prisma.healthProfile.create({
      data: {
        ...dto,
        userId,
        bmi,
        bmiCategory: this.getBmiCategory(bmi),
      },
    });
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.healthProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Health profile not found');
    }

    return profile;
  }

  async update(userId: string, dto: UpdateHealthProfileDto) {
    const profile = await this.findByUserId(userId);
    if (dto.painArea) {
      await this.painAreasService.ensureValid([dto.painArea]);
    }
    const height = dto.height ?? profile.height;
    const weight = dto.weight ?? profile.weight;
    const bmi = this.calculateBmi(height, weight);

    return this.prisma.healthProfile.update({
      where: { userId },
      data: {
        ...dto,
        bmi,
        bmiCategory: this.getBmiCategory(bmi),
      },
    });
  }

  private calculateBmi(heightCm: number, weightKg: number): number {
    const heightMeters = heightCm / 100;
    return Math.round((weightKg / heightMeters ** 2) * 100) / 100;
  }

  private getBmiCategory(bmi: number): string {
    if (bmi < 18.5) {
      return 'Underweight';
    }
    if (bmi < 25) {
      return 'Normal';
    }
    if (bmi < 30) {
      return 'Overweight';
    }
    return 'Obese';
  }
}
