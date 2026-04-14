import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoTurno } from '../entities/turno-llegada.entity';

export class CreateTurnoLlegadaDto {
  @ApiProperty({
    description: 'ID de la entidad que genera el ticket',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idEntidad: string;

  @ApiPropertyOptional({
    description: 'ID de la cita vinculada (null si es atención sin cita previa)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsOptional()
  idCita?: string;

  @ApiProperty({
    description: 'Código del ticket generado',
    example: 'A001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigoTicket: string;

  @ApiPropertyOptional({
    description: 'Estado inicial del turno',
    enum: EstadoTurno,
    default: EstadoTurno.EN_ESPERA,
  })
  @IsEnum(EstadoTurno)
  @IsOptional()
  estado?: EstadoTurno;
}
