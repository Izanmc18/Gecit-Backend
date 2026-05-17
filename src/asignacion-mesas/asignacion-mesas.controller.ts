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
    description: 'Desk assignment created successfully. Returns the new assignment.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data.' })
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
    status: 200,
    description: 'Returns a list of all desk assignments successfully.',
  })
  async findAll() {
    const asignaciones = await this.asignacionMesasService.findAll();
    return AsignacionMesaAdapter.toResponseList(asignaciones);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get one desk assignment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified desk assignment successfully.',
  })
  @ApiResponse({ status: 404, description: 'Desk assignment not found. The ID does not exist.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const asignacion = await this.asignacionMesasService.findOne(id);
    return AsignacionMesaAdapter.toResponse(asignacion);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a desk assignment by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Desk assignment updated successfully. Returns the updated assignment.',
  })
  @ApiResponse({ status: 404, description: 'Desk assignment not found. The ID does not exist.' })
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
    status: 200,
    description: 'Desk assignment deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Desk assignment not found. The ID does not exist.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.asignacionMesasService.remove(id);
  }
}
