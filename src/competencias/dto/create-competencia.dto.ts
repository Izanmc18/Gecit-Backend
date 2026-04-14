import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompetenciaDto {
  @ApiProperty({
    description: 'ID de la entidad a la que pertenece la competencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idEntidad: string;

  @ApiProperty({
    description: 'Nombre de la competencia (habilidad)',
    example: 'Atención Tributaria',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreCompetencia: string;
}
