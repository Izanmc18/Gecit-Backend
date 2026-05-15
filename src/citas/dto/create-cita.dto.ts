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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCitaDto {
  @ApiProperty({
    description: 'The first name of the client',
    example: 'María',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  clienteNombre: string;

  @ApiProperty({ description: 'The last name of the client', example: 'Gómez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  clienteApellidos: string;

  @ApiProperty({
    description: 'The DNI or ID document of the client',
    example: '12345678A',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  clienteDni: string;

  @ApiPropertyOptional({
    description: 'The email of the client',
    example: 'maria@email.com',
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  clienteEmail?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the client',
    example: '600123456',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  clienteTelefono?: string;

  @ApiPropertyOptional({
    description: 'The ID of the assigned employee',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  idUsuarioAsignado?: string;

  @ApiPropertyOptional({
    description: 'The ID of the table',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsOptional()
  idMesa?: string;

  @ApiPropertyOptional({
    description: 'The ID of the room/office',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  @IsUUID()
  @IsOptional()
  idSala?: string;

  @ApiProperty({
    description: 'The ID of the procedure',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  @IsNotEmpty()
  idTramite: string;

  @ApiProperty({
    description: 'The date and time of the appointment',
    example: '2024-11-20T10:30:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaHora: string;

  @ApiPropertyOptional({
    description: 'The status of the appointment',
    enum: EstadoCita,
    default: EstadoCita.PENDIENTE,
  })
  @IsEnum(EstadoCita)
  @IsOptional()
  estado?: EstadoCita;

  @ApiPropertyOptional({
    description: 'Additional notes or observations',
    example: 'El cliente traerá los documentos compulsados',
  })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
