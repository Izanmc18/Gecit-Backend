/* eslint-disable @typescript-eslint/unbound-method */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EntidadesService } from './entidades.service';
import { CreateEntidadDto, UpdateEntidadDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { EntidadAdapter } from './adapters/entidad.adapter';

@ApiTags('Entidades (Multitenant)')
@Controller('entidades')
export class EntidadesController {
  constructor(private readonly entidadesService: EntidadesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva entidad (Tenant)' })
  @ApiResponse({
    status: 201,
    description: 'La entidad ha sido creada exitosamente.',
  })
  async create(@Body() createEntidadDto: CreateEntidadDto) {
    const entidad = await this.entidadesService.create(createEntidadDto);
    return EntidadAdapter.toResponse(entidad);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de entidades paginada' })
  async findAll(@Query() paginationDto: PaginationDto) {
    const entidades = await this.entidadesService.findAll(paginationDto);
    return entidades.map(EntidadAdapter.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una entidad por su ID' })
  async findOne(@Param('id') id: string) {
    const entidad = await this.entidadesService.findOne(id);
    return EntidadAdapter.toResponse(entidad);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de una entidad' })
  async update(
    @Param('id') id: string,
    @Body() updateEntidadDto: UpdateEntidadDto,
  ) {
    const entidad = await this.entidadesService.update(id, updateEntidadDto);
    return EntidadAdapter.toResponse(entidad);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una entidad' })
  async remove(@Param('id') id: string) {
    await this.entidadesService.remove(id);
    return { message: `Entidad con id ${id} eliminada correctamente` };
  }
}
