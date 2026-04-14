import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTramiteDto {
  @ApiProperty({
    description: 'ID de la entidad a la que pertenece el trámite',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idEntidad: string;

  @ApiProperty({
    description: 'Nombre del trámite',
    example: 'Renovación de DNI',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreTramite: string;

  @ApiPropertyOptional({
    description: 'Descripción del trámite',
    example: 'Trámite para la renovación del documento nacional de identidad',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'ID de la competencia requerida para gestionar este trámite',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsOptional()
  idCompetenciaRequerida?: string;
}
