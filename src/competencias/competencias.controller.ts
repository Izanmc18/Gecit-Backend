import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CompetenciasService } from './competencias.service';
import { CreateCompetenciaDto, UpdateCompetenciaDto } from './dto';
import { CompetenciaAdapter } from './adapters/competencia.adapter';
import { Auth, CurrentUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Skills')
@ApiBearerAuth()
@Controller('skills')
export class CompetenciasController {
  constructor(private readonly competenciasService: CompetenciasService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Crear una nueva competencia (Admin)' })
  @ApiResponse({ status: 201, description: 'Competencia creada correctamente' })
  async create(@Body() createCompetenciaDto: CreateCompetenciaDto) {
    const competencia =
      await this.competenciasService.create(createCompetenciaDto);
    return CompetenciaAdapter.toResponse(competencia);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Obtener todas las competencias' })
  @ApiResponse({
    status: 201,
    description: 'The skills have been obtained successfully.',
  })
  async findAll(@CurrentUser() user: any) {
    const idEntidad = user?.idEntidad || user?.id_entidad;
    const competencias = await this.competenciasService.findAll(idEntidad);
    return CompetenciaAdapter.toResponseList(competencias);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Obtener una competencia por ID' })
  @ApiResponse({
    status: 201,
    description: 'The skill has been obtained successfully.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const competencia = await this.competenciasService.findOne(id);
    return CompetenciaAdapter.toResponse(competencia);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Actualizar una competencia (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'The skill has been updated successfully.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompetenciaDto: UpdateCompetenciaDto,
  ) {
    const competencia = await this.competenciasService.update(
      id,
      updateCompetenciaDto,
    );
    return CompetenciaAdapter.toResponse(competencia);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una competencia (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'The skill has been deleted successfully.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.competenciasService.remove(id);
  }

  @Post(':id/users/:idUsuario')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Asignar competencia a un usuario (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'The skill has been assigned successfully.',
  })
  async asignarUsuario(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('idUsuario', ParseUUIDPipe) idUsuario: string,
  ) {
    const competencia = await this.competenciasService.asignarUsuario(
      id,
      idUsuario,
    );
    return CompetenciaAdapter.toResponse(competencia);
  }

  @Delete(':id/users/:idUsuario')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Desasignar competencia de un usuario (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'The skill has been unassigned successfully.',
  })
  async desasignarUsuario(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('idUsuario', ParseUUIDPipe) idUsuario: string,
  ) {
    const competencia = await this.competenciasService.desasignarUsuario(
      id,
      idUsuario,
    );
    return CompetenciaAdapter.toResponse(competencia);
  }
}
