import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePainAreaDto } from './dto/create-pain-area.dto';

@Injectable()
export class PainAreasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.painArea.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreatePainAreaDto) {
    const name = this.normalizeName(dto.name);

    try {
      return await this.prisma.painArea.create({
        data: { name },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This pain area already exists');
      }
      throw error;
    }
  }

  async ensureValid(names: string[]): Promise<void> {
    const uniqueNames = [...new Set(names)];
    const count = await this.prisma.painArea.count({
      where: {
        name: { in: uniqueNames },
        isActive: true,
      },
    });

    if (count !== uniqueNames.length) {
      throw new BadRequestException(
        'One or more selected pain areas are invalid',
      );
    }
  }

  private normalizeName(value: string): string {
    const name = value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    if (!name) {
      throw new BadRequestException('Pain area name is required');
    }
    return name;
  }
}
