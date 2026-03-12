import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTramiteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreTramite: string;
}
