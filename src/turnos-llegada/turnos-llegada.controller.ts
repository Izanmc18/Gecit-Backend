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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TurnosLlegadaService } from './turnos-llegada.service';
import {
  CreateTurnoLlegadaDto,
  UpdateTurnoLlegadaDto,
  CheckinDto,
} from './dto';
import { TurnoLlegadaAdapter } from './adapters/turno-llegada.adapter';
import { Auth, CurrentUser } from '../auth/decorators';
import { Public } from '../auth/decorators/public.decorator';
import { ValidRoles } from '../auth/interfaces';
import { Usuario } from '../usuarios/entities/usuario.entity';

@ApiTags('Tickets (Turnos de Llegada)')
@ApiBearerAuth()
@Controller('tickets')
export class TurnosLlegadaController {
  constructor(private readonly turnosLlegadaService: TurnosLlegadaService) {}

  @Post('checkin')
  @Public()
  @ApiOperation({
    summary: 'Check-in de usuario público para solicitar ticket automático',
  })
  async checkin(@Body() checkinDto: CheckinDto) {
    return this.turnosLlegadaService.handleCheckin(checkinDto);
  }

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Generar un nuevo ticket de turno manual' })
  @ApiResponse({ status: 201, description: 'Ticket generado correctamente' })
  async create(@Body() createDto: CreateTurnoLlegadaDto) {
    const turno = await this.turnosLlegadaService.create(createDto);
    return TurnoLlegadaAdapter.toResponse(turno);
  }

  @Get('display')
  @Public()
  @ApiOperation({
    summary: 'Vista optimizada de pantallas para TV en sala de espera',
  })
  @ApiQuery({ name: 'idEntidad', required: true })
  @ApiResponse({
    status: 200,
    description: 'view optimized for screens in waiting room',
  })
  async getDisplay(@Query('idEntidad') idEntidad: string) {
    return this.turnosLlegadaService.getDisplayData(idEntidad);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Obtener todos los tickets o filtrar por entidad' })
  @ApiQuery({
    name: 'idEntidad',
    required: false,
    description: 'Filtrar por entidad',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tickets',
  })
  async findAll(@Query('idEntidad') idEntidad?: string) {
    if (idEntidad) {
      const turnos = await this.turnosLlegadaService.findByEntidad(idEntidad);
      return TurnoLlegadaAdapter.toResponseList(turnos);
    }
    const turnos = await this.turnosLlegadaService.findAll();
    return TurnoLlegadaAdapter.toResponseList(turnos);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Obtener un ticket por ID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket found successfully.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const turno = await this.turnosLlegadaService.findOne(id);
    return TurnoLlegadaAdapter.toResponse(turno);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Actualizar un ticket' })
  @ApiResponse({
    status: 200,
    description: 'Ticket updated successfully.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTurnoLlegadaDto,
  ) {
    const turno = await this.turnosLlegadaService.update(id, updateDto);
    return TurnoLlegadaAdapter.toResponse(turno);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un ticket (Admin)' })
  @ApiResponse({
    status: 204,
    description: 'Ticket deleted successfully.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.turnosLlegadaService.remove(id);
  }

  @Patch(':id/call')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Llamar un turno (cambiar estado a Llamado)' })
  @ApiResponse({
    status: 200,
    description: 'Ticket called successfully.',
  })
  async llamarTurno(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    const turno = await this.turnosLlegadaService.llamarTurno(id, user.id);
    return TurnoLlegadaAdapter.toResponse(turno);
  }

  @Patch(':id/attend')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Marcar turno como atendido' })
  @ApiResponse({
    status: 200,
    description: 'Ticket attended successfully.',
  })
  async atenderTurno(@Param('id', ParseUUIDPipe) id: string) {
    const turno = await this.turnosLlegadaService.atenderTurno(id);
    return TurnoLlegadaAdapter.toResponse(turno);
  }

  @Patch(':id/discard')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Descartar un turno (cliente no presentado)' })
  @ApiResponse({
    status: 200,
    description: 'Ticket discarded successfully.',
  })
  async descartarTurno(@Param('id', ParseUUIDPipe) id: string) {
    const turno = await this.turnosLlegadaService.descartarTurno(id);
    return TurnoLlegadaAdapter.toResponse(turno);
  }
}
