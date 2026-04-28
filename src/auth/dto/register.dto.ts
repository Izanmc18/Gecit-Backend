import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Izan' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Martinez' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({ example: '12345678A' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ example: 'izan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '600123456' })
  @IsString()
  @IsNotEmpty()
  telefono: string;
}
