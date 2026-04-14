import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSalaDto {
  @ApiProperty({
    description: 'ID de la entidad a la que pertenece la sala',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idEntidad: string;

  @ApiProperty({
    description: 'Nombre de la sala',
    example: 'Sala de Atención al Ciudadano',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreSala: string;

  @ApiPropertyOptional({
    description: 'Ancho del canvas en píxeles',
    example: 800,
    default: 800,
  })
  @IsInt()
  @Min(100)
  @IsOptional()
  canvasWidth?: number;

  @ApiPropertyOptional({
    description: 'Alto del canvas en píxeles',
    example: 600,
    default: 600,
  })
  @IsInt()
  @Min(100)
  @IsOptional()
  canvasHeight?: number;

  @ApiPropertyOptional({
    description: 'Color de fondo del canvas en formato hexadecimal',
    example: '#F0F0F0',
    default: '#FFFFFF',
  })
  @IsString()
  @IsOptional()
  colorFondo?: string;
}
