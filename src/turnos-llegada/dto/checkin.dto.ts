import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckinDto {
  @ApiProperty({ example: '12345678X' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  idEntidad: string;
}
