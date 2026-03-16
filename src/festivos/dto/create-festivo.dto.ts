import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateFestivoDto {
  @IsUUID()
  @IsNotEmpty()
  idOficina: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  descripcion?: string;
}
