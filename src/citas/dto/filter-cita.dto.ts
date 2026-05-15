import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { EstadoCita } from '../entities/cita.entity';

export class FilterCitaDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  idEntidad?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  idUsuarioAsignado?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  idCliente?: string;

  @ApiPropertyOptional({ enum: EstadoCita })
  @IsEnum(EstadoCita)
  @IsOptional()
  estado?: EstadoCita;

  @ApiPropertyOptional({ example: '2026-04-20' })
  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @ApiPropertyOptional({ example: '2026-04-26' })
  @IsDateString()
  @IsOptional()
  fechaFin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  includeUnassigned?: string; // Usamos string porque llega por query param ('true' o 'false')
}
