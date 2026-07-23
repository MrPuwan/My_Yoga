import { NotFoundException } from '@nestjs/common';
import { Difficulty } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { YogaPosesService } from './yoga-poses.service';
import { PainAreasService } from '../pain-areas/pain-areas.service';

describe('YogaPosesService', () => {
  let service: YogaPosesService;
  const prisma = {
    yogaPose: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YogaPosesService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: PainAreasService,
          useValue: { ensureValid: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(YogaPosesService);
  });

  it('returns poses with pagination metadata', async () => {
    const poses = [{ id: 'pose-1', name: 'Tree Pose' }];
    prisma.$transaction.mockResolvedValue([poses, 11]);

    await expect(
      service.findAll({
        page: 2,
        limit: 5,
        difficulty: Difficulty.BEGINNER,
      }),
    ).resolves.toEqual({
      data: poses,
      meta: { page: 2, limit: 5, total: 11, totalPages: 3 },
    });
  });

  it('soft deletes an existing pose', async () => {
    const pose = { id: 'pose-1', isActive: true };
    prisma.yogaPose.findUnique.mockResolvedValue(pose);
    prisma.yogaPose.update.mockResolvedValue({ ...pose, isActive: false });

    await expect(service.remove('pose-1')).resolves.toMatchObject({
      isActive: false,
    });
    expect(prisma.yogaPose.update).toHaveBeenCalledWith({
      where: { id: 'pose-1' },
      data: { isActive: false },
    });
  });

  it('rejects a missing pose', async () => {
    prisma.yogaPose.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
