import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSalaDto {
  @IsUUID()
  @IsNotEmpty()
  idOficina: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreSala: string;
}
