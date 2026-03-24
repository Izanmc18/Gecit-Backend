import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTramiteDto {
  @ApiProperty({
    description: 'The name of the procedure',
    example: 'Renovación de DNI',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreTramite: string;
}
