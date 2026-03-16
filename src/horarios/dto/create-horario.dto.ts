import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateHorarioDto {
  @IsUUID()
  @IsNotEmpty()
  idOficina: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'horaApertura debe tener un formato válido (HH:mm o HH:mm:ss)',
  })
  horaApertura: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'horaCierre debe tener un formato válido (HH:mm o HH:mm:ss)',
  })
  horaCierre: string;
}
