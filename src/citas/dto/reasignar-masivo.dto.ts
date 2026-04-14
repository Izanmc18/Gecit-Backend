import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReasignarMasivoDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  idEmpleadoOrigen: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  idEmpleadoDestino: string;

  @ApiProperty({ example: '2026-04-20' })
  @IsDateString()
  @IsNotEmpty()
  fechaDesde: string;

  @ApiProperty({ example: '2026-04-30' })
  @IsDateString()
  @IsNotEmpty()
  fechaHasta: string;
}
