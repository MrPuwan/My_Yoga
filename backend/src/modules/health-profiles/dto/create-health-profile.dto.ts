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

export class CreateHealthProfileDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(120)
  age: number;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  gender: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  height: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  weight: number;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  painArea: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  activityLevel?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  medicalConditions?: string;
}
