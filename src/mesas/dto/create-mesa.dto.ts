import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMesaDto {
  @ApiProperty({
    description: 'The ID of the room',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idSala: string;

  @ApiProperty({
    description: 'The name of the table',
    example: 'Mesa 1 - Atención al Cliente',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombreMesa: string;
}
