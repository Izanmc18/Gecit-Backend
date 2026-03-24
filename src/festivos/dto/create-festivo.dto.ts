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
    description: 'The ID of the office',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idOficina: string;

  @ApiProperty({
    description: 'The date of the holiday',
    example: '2024-12-25',
  })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiPropertyOptional({
    description: 'Description of the holiday',
    example: 'Navidad',
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  descripcion?: string;
}
