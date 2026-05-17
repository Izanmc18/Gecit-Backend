import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AusenciasService } from './ausencias.service';
import { CreateAusenciaDto, UpdateAusenciaDto, FilterAusenciaDto } from './dto';
import { AusenciaAdapter } from './adapters/ausencia.adapter';
import { Auth, CurrentUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Absences')
@ApiBearerAuth()
@Controller('absences')
export class AusenciasController {
  constructor(private readonly ausenciasService: AusenciasService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Create a new absence request' })
  @ApiResponse({
    status: 201,
    description: 'Absence request created successfully. Returns the new request.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data.' })
  async create(@Body() createAusenciaDto: CreateAusenciaDto) {
    const ausencia = await this.ausenciasService.create(createAusenciaDto);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a list of all absence requests' })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of absence requests successfully.',
  })
  async findAll(
    @Query() filterAusenciaDto: FilterAusenciaDto,
    @CurrentUser('idEntidad') idEntidad: string,
  ) {
    const { data, meta } = await this.ausenciasService.findAll(
      filterAusenciaDto,
      idEntidad,
    );
    return {
      data: AusenciaAdapter.toResponseList(data),
      meta,
    };
  }

  @Patch(':id/approve')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Approve an absence request (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Absence request approved successfully. Returns the updated request.',
  })
  @ApiResponse({ status: 404, description: 'Absence request not found. The ID does not exist.' })
  async approve(@Param('id', ParseUUIDPipe) id: string) {
    const ausencia = await this.ausenciasService.approve(id);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Patch(':id/reject')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Reject an absence request (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Absence request rejected successfully. Returns the updated request.',
  })
  @ApiResponse({ status: 404, description: 'Absence request not found. The ID does not exist.' })
  async reject(@Param('id', ParseUUIDPipe) id: string) {
    const ausencia = await this.ausenciasService.reject(id);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get one absence request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified absence request successfully.',
  })
  @ApiResponse({ status: 404, description: 'Absence request not found. The ID does not exist.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const ausencia = await this.ausenciasService.findOne(id);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Update an absence request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Absence request updated successfully. Returns the updated request.',
  })
  @ApiResponse({ status: 404, description: 'Absence request not found. The ID does not exist.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAusenciaDto: UpdateAusenciaDto,
  ) {
    const ausencia = await this.ausenciasService.update(id, updateAusenciaDto);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Delete an absence request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Absence request deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Absence request not found. The ID does not exist.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ausenciasService.remove(id);
  }
}
