import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TramitesService } from './tramites.service';
import { CreateTramiteDto, UpdateTramiteDto } from './dto';
import { TramiteAdapter } from './adapters/tramite.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Procedures')
@ApiBearerAuth()
@Controller('procedures')
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new procedure (Admin only)' })
  @ApiResponse({ status: 201, description: 'Procedure created successfully.' })
  async create(@Body() createTramiteDto: CreateTramiteDto) {
    const tramite = await this.tramitesService.create(createTramiteDto);
    return TramiteAdapter.toResponse(tramite);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get all procedures' })
  @ApiResponse({
    status: 201,
    description: 'Procedures found successfully.',
  })
  async findAll() {
    const tramites = await this.tramitesService.findAll();
    return TramiteAdapter.toResponseList(tramites);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a procedure by ID' })
  @ApiResponse({
    status: 201,
    description: 'Procedure found successfully.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const tramite = await this.tramitesService.findOne(id);
    return TramiteAdapter.toResponse(tramite);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a procedure' })
  @ApiResponse({
    status: 201,
    description: 'Procedure updated successfully.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTramiteDto: UpdateTramiteDto,
  ) {
    const tramite = await this.tramitesService.update(id, updateTramiteDto);
    return TramiteAdapter.toResponse(tramite);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a procedure' })
  @ApiResponse({
    status: 201,
    description: 'Procedure deleted successfully.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tramitesService.remove(id);
  }
}
