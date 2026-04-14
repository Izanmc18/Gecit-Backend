import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
