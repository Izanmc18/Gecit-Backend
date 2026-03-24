import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { TurnoAsignacion } from '../entities/asignacion-mesa.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAsignacionMesaDto {
  @ApiProperty({
    description: 'The ID of the employee (User)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idUsuario: string;

  @ApiProperty({
    description: 'The ID of the desk/table',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  idMesa: string;

  @ApiProperty({
    description: 'The date of the assignment',
    example: '2024-11-20',
  })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiPropertyOptional({
    description: 'The work shift',
    enum: TurnoAsignacion,
    default: TurnoAsignacion.COMPLETO,
  })
  @IsEnum(TurnoAsignacion)
  @IsOptional()
  turno?: TurnoAsignacion;
}
