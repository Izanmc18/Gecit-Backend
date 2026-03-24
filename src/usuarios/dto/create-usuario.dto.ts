import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'The ID of the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idRol: string;

  @ApiProperty({ description: 'The first name of the user', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  apellidos: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'juan@empresa.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    description: 'The password (minimum 6 characters)',
    example: 'secret123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  passwordHash: string;

  @ApiPropertyOptional({
    description: 'The URL of the profile picture',
    example: 'https://mysite.com/photo.jpg',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  fotoUrl?: string;
}
