import { NotFoundException } from '@nestjs/common';
import {
  Difficulty,
  type HealthProfile,
  type YogaPose,
} from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  const prisma = {
    healthProfile: { findUnique: jest.fn() },
    yogaPose: { findMany: jest.fn() },
  };

  const profile = (
    overrides: Partial<HealthProfile> = {},
  ): HealthProfile => ({
    id: 'profile-1',
    userId: 'user-1',
    age: 30,
    gender: 'Female',
    height: 165,
    weight: 60,
    bmi: 22.04,
    bmiCategory: 'Normal',
    painArea: 'BACK',
    activityLevel: 'Moderately active',
    medicalConditions: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const pose = (overrides: Partial<YogaPose> = {}): YogaPose => ({
    id: 'pose-1',
    name: 'Child Pose',
    description: 'A gentle resting pose',
    instructions: ['Kneel down'],
    benefits: ['Relaxes the back'],
    precautions: ['Avoid with knee injury'],
    difficulty: Difficulty.BEGINNER,
    imageUrl: null,
    durationSeconds: 60,
    targetAreas: ['Back'],
    suitablePainAreas: ['BACK'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(RecommendationsService);
  });

  it('returns a clear error when the health profile is missing', async () => {
    prisma.healthProfile.findUnique.mockResolvedValue(null);

    await expect(service.getForUser('user-1')).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.yogaPose.findMany).not.toHaveBeenCalled();
  });

  it('scores an exact pain-area match above a general pose', async () => {
    prisma.healthProfile.findUnique.mockResolvedValue(profile());
    prisma.yogaPose.findMany.mockResolvedValue([
      pose({ id: 'general', suitablePainAreas: ['NONE'] }),
      pose({ id: 'exact', suitablePainAreas: ['BACK'] }),
    ]);

    const result = await service.getForUser('user-1');

    expect(result.map((item) => item.yogaPose.id)).toEqual(['exact', 'general']);
    expect(result[0].matchScore).toBeGreaterThan(result[1].matchScore);
    expect(result[0].reason).toContain('Matches your back pain area');
  });

  it('returns beginner general-wellness poses for NONE pain area', async () => {
    prisma.healthProfile.findUnique.mockResolvedValue(
      profile({ painArea: 'NONE', activityLevel: 'Very active' }),
    );
    prisma.yogaPose.findMany.mockResolvedValue([
      pose({ id: 'beginner', suitablePainAreas: ['NONE'] }),
      pose({
        id: 'advanced',
        difficulty: Difficulty.ADVANCED,
        suitablePainAreas: ['NONE'],
      }),
      pose({ id: 'specific', suitablePainAreas: ['BACK'] }),
    ]);

    const result = await service.getForUser('user-1');

    expect(result).toHaveLength(1);
    expect(result[0].yogaPose.id).toBe('beginner');
    expect(result[0].reason).toContain('Supports general wellness');
  });

  it('excludes ADVANCED poses for an Obese BMI category', async () => {
    prisma.healthProfile.findUnique.mockResolvedValue(
      profile({ bmiCategory: 'Obese', activityLevel: 'Very active' }),
    );
    prisma.yogaPose.findMany.mockResolvedValue([
      pose({ id: 'beginner' }),
      pose({ id: 'advanced', difficulty: Difficulty.ADVANCED }),
    ]);

    const result = await service.getForUser('user-1');

    expect(result.map((item) => item.yogaPose.id)).toEqual(['beginner']);
  });

  it('prefers BEGINNER poses for low activity', async () => {
    prisma.healthProfile.findUnique.mockResolvedValue(
      profile({ activityLevel: 'Sedentary' }),
    );
    prisma.yogaPose.findMany.mockResolvedValue([
      pose({ id: 'beginner' }),
      pose({ id: 'intermediate', difficulty: Difficulty.INTERMEDIATE }),
    ]);

    const result = await service.getForUser('user-1');

    expect(result).toHaveLength(1);
    expect(result[0].yogaPose.difficulty).toBe(Difficulty.BEGINNER);
    expect(result[0].reason).toContain('Beginner-friendly');
  });

  it('returns only active poses', async () => {
    prisma.healthProfile.findUnique.mockResolvedValue(profile());
    prisma.yogaPose.findMany.mockResolvedValue([
      pose({ id: 'active' }),
      pose({ id: 'inactive', isActive: false }),
    ]);

    const result = await service.getForUser('user-1');

    expect(result.map((item) => item.yogaPose.id)).toEqual(['active']);
    expect(prisma.yogaPose.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      }),
    );
  });

  it('sorts scores descending and limits results to 10', async () => {
    prisma.healthProfile.findUnique.mockResolvedValue(profile());
    prisma.yogaPose.findMany.mockResolvedValue([
      ...Array.from({ length: 10 }, (_, index) =>
        pose({
          id: `general-${index}`,
          suitablePainAreas: ['NONE'],
        }),
      ),
      pose({ id: 'exact', suitablePainAreas: ['BACK'] }),
    ]);

    const result = await service.getForUser('user-1');

    expect(result).toHaveLength(10);
    expect(result[0].yogaPose.id).toBe('exact');
    expect(result.every((item, index) =>
      index === 0 || result[index - 1].matchScore >= item.matchScore,
    )).toBe(true);
  });
});
