import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Izan' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Martinez Castro' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({ example: '12345678X' })
  @IsString()
  @IsOptional()
  dni?: string;

  @ApiPropertyOptional({ example: '+34600123456' })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({ example: 'izan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'uuid-del-rol' })
  @IsUUID()
  idRol: string;

  @ApiPropertyOptional({ example: 'uuid-de-la-entidad' })
  @IsUUID()
  @IsOptional()
  idEntidad?: string;

  @ApiPropertyOptional({ example: 'https://mi-imagen.com/foto.jpg' })
  @IsString()
  @IsOptional()
  fotoUrl?: string;
}
