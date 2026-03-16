import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMesaDto {
  @IsUUID()
  @IsNotEmpty()
  idSala: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombreMesa: string;
}
