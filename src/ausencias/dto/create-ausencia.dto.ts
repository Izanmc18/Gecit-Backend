import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { EstadoAusencia, TipoAusencia } from '../entities/ausencia.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAusenciaDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idUsuario: string;

  @ApiProperty({
    description: 'The date the request was made',
    example: '2024-10-25',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaSolicitud: string;

  @ApiProperty({
    description: 'The start date of the absence',
    example: '2024-11-01',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @ApiProperty({
    description: 'The end date of the absence',
    example: '2024-11-15',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @ApiProperty({
    description: 'The type of absence',
    enum: TipoAusencia,
    example: TipoAusencia.VACACIONES,
  })
  @IsEnum(TipoAusencia)
  @IsNotEmpty()
  tipo: TipoAusencia;

  @ApiPropertyOptional({
    description: 'The status of the request',
    enum: EstadoAusencia,
    default: EstadoAusencia.PENDIENTE,
  })
  @IsEnum(EstadoAusencia)
  @IsOptional()
  estado?: EstadoAusencia;
}
