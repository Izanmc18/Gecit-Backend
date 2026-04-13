import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEntidadDto {
  @ApiProperty({ example: 'InnovaSur S.L.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;

  @ApiProperty({ example: 'B12345678' })
  @IsString()
  @IsNotEmpty()
  cif: string;

  @ApiPropertyOptional({ example: 'innovasur.gecit.com' })
  @IsString()
  @IsOptional()
  dominio?: string;

  @ApiPropertyOptional({ example: 30, default: 30 })
  @IsInt()
  @IsOptional()
  duracionCitaMinutos?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
