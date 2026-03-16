import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { EstadoAusencia, TipoAusencia } from '../entities/ausencia.entity';

export class CreateAusenciaDto {
  @IsUUID()
  @IsNotEmpty()
  idUsuario: string;

  @IsDateString()
  @IsNotEmpty()
  fechaSolicitud: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @IsEnum(TipoAusencia)
  @IsNotEmpty()
  tipo: TipoAusencia;

  @IsEnum(EstadoAusencia)
  @IsOptional()
  estado?: EstadoAusencia;
}
