import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { EstadoCita } from '../entities/cita.entity';

export class CreateCitaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  clienteNombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  clienteApellidos: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  clienteDni: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  clienteEmail?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  clienteTelefono?: string;

  @IsUUID()
  @IsNotEmpty()
  idUsuarioAsignado: string;

  @IsUUID()
  @IsNotEmpty()
  idMesa: string;

  @IsUUID()
  @IsNotEmpty()
  idTramite: string;

  @IsDateString()
  @IsNotEmpty()
  fechaHora: string;

  @IsEnum(EstadoCita)
  @IsOptional()
  estado?: EstadoCita;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
