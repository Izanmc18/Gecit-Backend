import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export enum EstadoAusencia {
  PENDIENTE = 'Pendiente',
  APROBADA = 'Aprobada',
  RECHAZADA = 'Rechazada',
}

export class FilterAusenciaDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  idUsuario?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  idEntidad?: string;

  @ApiPropertyOptional({ enum: EstadoAusencia })
  @IsEnum(EstadoAusencia)
  @IsOptional()
  estado?: string;
}
