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
  @ApiOperation({ summary: 'Create a new skill (Admin only)' })
  @ApiResponse({ status: 201, description: 'Skill created successfully. Returns the new skill.' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data.' })
  async create(@Body() createCompetenciaDto: CreateCompetenciaDto) {
    const competencia =
      await this.competenciasService.create(createCompetenciaDto);
    return CompetenciaAdapter.toResponse(competencia);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all skills successfully.',
  })
  async findAll(@CurrentUser() user: any) {
    const idEntidad = user?.idEntidad || user?.id_entidad;
    const competencias = await this.competenciasService.findAll(idEntidad);
    return CompetenciaAdapter.toResponseList(competencias);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a skill by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified skill successfully.',
  })
  @ApiResponse({ status: 404, description: 'Skill not found. The ID does not exist.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const competencia = await this.competenciasService.findOne(id);
    return CompetenciaAdapter.toResponse(competencia);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a skill by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Skill updated successfully. Returns the updated skill.',
  })
  @ApiResponse({ status: 404, description: 'Skill not found. The ID does not exist.' })
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
  @ApiOperation({ summary: 'Delete a skill by ID (Admin only)' })
  @ApiResponse({
    status: 204,
    description: 'Skill deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Skill not found. The ID does not exist.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.competenciasService.remove(id);
  }

  @Post(':id/users/:idUsuario')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Assign a skill to a user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Skill assigned to user successfully. Returns the updated skill.',
  })
  @ApiResponse({ status: 404, description: 'Skill or User not found.' })
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
  @ApiOperation({ summary: 'Unassign a skill from a user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Skill unassigned from user successfully. Returns the updated skill.',
  })
  @ApiResponse({ status: 404, description: 'Skill or User not found.' })
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
