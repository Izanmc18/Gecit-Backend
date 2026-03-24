import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolDto {
  @ApiProperty({ description: 'The name of the role', example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombreRol: string;
}
