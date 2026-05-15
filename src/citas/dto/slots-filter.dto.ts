import { IsDateString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SlotsFilterDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  idEntidad: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  idTramite: string;

  @ApiProperty({ example: '2026-04-20' })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  idSala?: string;
}
