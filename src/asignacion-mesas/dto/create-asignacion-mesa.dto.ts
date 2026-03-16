import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { TurnoAsignacion } from '../entities/asignacion-mesa.entity';

export class CreateAsignacionMesaDto {
  @IsUUID()
  @IsNotEmpty()
  idUsuario: string;

  @IsUUID()
  @IsNotEmpty()
  idMesa: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsEnum(TurnoAsignacion)
  @IsOptional()
  turno?: TurnoAsignacion;
}
