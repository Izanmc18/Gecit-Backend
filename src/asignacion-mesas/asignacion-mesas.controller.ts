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
import { AsignacionMesasService } from './asignacion-mesas.service';
import { CreateAsignacionMesaDto, UpdateAsignacionMesaDto } from './dto';
import { AsignacionMesaAdapter } from './adapters/asignacion-mesa.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Desk Assignments')
@ApiBearerAuth()
@Controller('desk-assignments')
export class AsignacionMesasController {
  constructor(
    private readonly asignacionMesasService: AsignacionMesasService,
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new desk assignment (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Desk assignment created successfully.',
  })
  async create(@Body() createAsignacionMesaDto: CreateAsignacionMesaDto) {
    const asignacion = await this.asignacionMesasService.create(
      createAsignacionMesaDto,
    );
    return AsignacionMesaAdapter.toResponse(asignacion);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a list of all desk assignments' })
  @ApiResponse({
    status: 201,
    description: 'Desk assignments found successfully.',
  })
  async findAll() {
    const asignaciones = await this.asignacionMesasService.findAll();
    return AsignacionMesaAdapter.toResponseList(asignaciones);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get one desk assignment by ID' })
  @ApiResponse({
    status: 201,
    description: 'Desk assignment found successfully.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const asignacion = await this.asignacionMesasService.findOne(id);
    return AsignacionMesaAdapter.toResponse(asignacion);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a desk assignment by ID (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Desk assignment updated successfully.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAsignacionMesaDto: UpdateAsignacionMesaDto,
  ) {
    const asignacion = await this.asignacionMesasService.update(
      id,
      updateAsignacionMesaDto,
    );
    return AsignacionMesaAdapter.toResponse(asignacion);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a desk assignment by ID (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Desk assignment deleted successfully.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.asignacionMesasService.remove(id);
  }
}
