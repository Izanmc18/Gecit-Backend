import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHorarioDto {
  @ApiProperty({
    description: 'The ID of the office',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idOficina: string;

  @ApiProperty({
    description: 'The start date of this schedule',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @ApiProperty({
    description: 'The end date of this schedule',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @ApiProperty({ description: 'The opening time', example: '08:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'horaApertura debe tener un formato válido (HH:mm o HH:mm:ss)',
  })
  horaApertura: string;

  @ApiProperty({ description: 'The closing time', example: '15:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'horaCierre debe tener un formato válido (HH:mm o HH:mm:ss)',
  })
  horaCierre: string;
}
