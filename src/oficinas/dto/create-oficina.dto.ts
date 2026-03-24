import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOficinaDto {
  @ApiProperty({
    description: 'The name of the office',
    example: 'Oficina Central',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({
    description: 'The address of the office',
    example: 'Calle Mayor 1, Madrid',
  })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiPropertyOptional({
    description: 'The duration of each appointment in minutes',
    example: 30,
    default: 30,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  duracionCitaMinutos?: number;
}
