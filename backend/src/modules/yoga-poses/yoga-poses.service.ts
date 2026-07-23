import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateYogaPoseDto } from './dto/create-yoga-pose.dto';
import { UpdateYogaPoseDto } from './dto/update-yoga-pose.dto';
import { ListYogaPosesQueryDto } from './dto/list-yoga-poses-query.dto';

@Injectable()
export class YogaPosesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateYogaPoseDto) {
    await this.ensureNameIsUnique(dto.name);

    try {
      return await this.prisma.yogaPose.create({ data: dto });
    } catch (error) {
      this.handleDuplicateName(error);
      throw error;
    }
  }

  async findAll(query: ListYogaPosesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.YogaPoseWhereInput = {
      difficulty: query.difficulty,
      isActive: query.isActive,
      suitablePainAreas: query.painArea
        ? { has: query.painArea }
        : undefined,
      name: query.search
        ? { contains: query.search.trim(), mode: 'insensitive' }
        : undefined,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.yogaPose.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.yogaPose.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const pose = await this.prisma.yogaPose.findUnique({ where: { id } });

    if (!pose) {
      throw new NotFoundException('Yoga pose not found');
    }

    return pose;
  }

  async update(id: string, dto: UpdateYogaPoseDto) {
    await this.findOne(id);

    if (dto.name) {
      await this.ensureNameIsUnique(dto.name, id);
    }

    try {
      return await this.prisma.yogaPose.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.handleDuplicateName(error);
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.yogaPose.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async ensureNameIsUnique(name: string, excludedId?: string) {
    const existingPose = await this.prisma.yogaPose.findFirst({
      where: {
        name: { equals: name.trim(), mode: 'insensitive' },
        id: excludedId ? { not: excludedId } : undefined,
      },
    });

    if (existingPose) {
      throw new ConflictException('A yoga pose with this name already exists');
    }
  }

  private handleDuplicateName(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('A yoga pose with this name already exists');
    }
  }
}
