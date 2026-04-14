import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFestivoDto {
  @ApiProperty({
    description: 'ID de la entidad (organización)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idEntidad: string;

  @ApiProperty({
    description: 'Fecha del festivo (YYYY-MM-DD)',
    example: '2024-12-25',
  })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiPropertyOptional({
    description: 'Descripción del festivo',
    example: 'Navidad',
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  descripcion?: string;
}
