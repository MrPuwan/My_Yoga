import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class UpdateHealthProfileDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  gender?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  height?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  weight?: number;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  painArea?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  activityLevel?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  medicalConditions?: string;
}
