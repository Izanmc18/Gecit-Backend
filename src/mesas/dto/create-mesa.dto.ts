import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMesaDto {
  @ApiProperty({
    description: 'ID de la sala a la que pertenece la mesa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idSala: string;

  @ApiProperty({
    description: 'Nombre de la mesa',
    example: 'Mesa 1 - Atención al Cliente',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombreMesa: string;

  @ApiPropertyOptional({
    description: 'Posición X en el canvas',
    example: 100,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  posX?: number;

  @ApiPropertyOptional({
    description: 'Posición Y en el canvas',
    example: 150,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  posY?: number;

  @ApiPropertyOptional({
    description: 'Rotación en grados',
    example: 0,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  rotacion?: number;
}
