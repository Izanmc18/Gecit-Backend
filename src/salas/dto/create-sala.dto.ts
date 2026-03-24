import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalaDto {
  @ApiProperty({
    description: 'The ID of the office',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idOficina: string;

  @ApiProperty({
    description: 'The name of the room',
    example: 'Sala de Reuniones A',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreSala: string;
}
