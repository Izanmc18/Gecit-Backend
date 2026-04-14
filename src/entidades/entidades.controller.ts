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

@ApiTags('Entities (Multitenant)')
@Controller('entities')
export class EntidadesController {
  constructor(private readonly entidadesService: EntidadesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new entity (Tenant)' })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully.',
  })
  async create(@Body() createEntidadDto: CreateEntidadDto) {
    const entidad = await this.entidadesService.create(createEntidadDto);
    return EntidadAdapter.toResponse(entidad);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of entities' })
  @ApiResponse({
    status: 200,
    description: 'List of entities',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const entidades = await this.entidadesService.findAll(paginationDto);
    return entidades.map(EntidadAdapter.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an entity by ID' })
  @ApiResponse({
    status: 200,
    description: 'Entity found successfully.',
  })
  async findOne(@Param('id') id: string) {
    const entidad = await this.entidadesService.findOne(id);
    return EntidadAdapter.toResponse(entidad);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an entity' })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEntidadDto: UpdateEntidadDto,
  ) {
    const entidad = await this.entidadesService.update(id, updateEntidadDto);
    return EntidadAdapter.toResponse(entidad);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an entity' })
  @ApiResponse({
    status: 200,
    description: 'Entity deleted successfully.',
  })
  async remove(@Param('id') id: string) {
    await this.entidadesService.remove(id);
    return { message: `Entidad con id ${id} eliminada correctamente` };
  }
}
