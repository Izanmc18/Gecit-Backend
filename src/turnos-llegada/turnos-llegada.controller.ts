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
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable, filter } from 'rxjs';
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
    summary: 'Public check-in for automatic ticket generation',
  })
  @ApiResponse({ status: 201, description: 'Ticket created successfully. Returns the new ticket.' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data.' })
  async checkin(@Body() checkinDto: CheckinDto) {
    return this.turnosLlegadaService.handleCheckin(checkinDto);
  }

  @Sse('events/:idEntidadOrSlug')
  @Public()
  @ApiOperation({ summary: 'Real-time event stream for an entity using SSE' })
  events(@Param('idEntidadOrSlug') idEntidadOrSlug: string): Observable<MessageEvent> {
    return this.turnosLlegadaService.getEventsObservable().pipe(
      filter((event: any) => 
        event.data.idEntidad === idEntidadOrSlug || 
        event.data.slugEntidad === idEntidadOrSlug
      ),
    );
  }

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Generate a new manual ticket' })
  @ApiResponse({ status: 201, description: 'Ticket generated successfully. Returns the new ticket.' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data.' })
  async create(@Body() createDto: CreateTurnoLlegadaDto) {
    const turno = await this.turnosLlegadaService.create(createDto);
    return TurnoLlegadaAdapter.toResponse(turno);
  }

  @Get('display')
  @Public()
  @ApiOperation({
    summary: 'Optimized view for TV screens in the waiting room',
  })
  @ApiQuery({ name: 'idEntidad', required: false })
  @ApiQuery({ name: 'slug', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns optimized data for the display screen.',
  })
  async getDisplay(
    @Query('idEntidad') idEntidad?: string,
    @Query('slug') slug?: string,
  ) {
    return this.turnosLlegadaService.getDisplayData(idEntidad, slug);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get all tickets or filter by entity' })
  @ApiQuery({
    name: 'idEntidad',
    required: false,
    description: 'Filter by entity ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of tickets successfully.',
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
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified ticket successfully.',
  })
  @ApiResponse({ status: 404, description: 'Ticket not found. The ID does not exist.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const turno = await this.turnosLlegadaService.findOne(id);
    return TurnoLlegadaAdapter.toResponse(turno);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Update a ticket by ID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket updated successfully. Returns the updated ticket.',
  })
  @ApiResponse({ status: 404, description: 'Ticket not found. The ID does not exist.' })
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
  @ApiOperation({ summary: 'Delete a ticket by ID (Admin)' })
  @ApiResponse({
    status: 204,
    description: 'Ticket deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Ticket not found. The ID does not exist.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.turnosLlegadaService.remove(id);
  }

  @Patch(':id/call')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Call a ticket (changes status to Called)' })
  @ApiResponse({
    status: 200,
    description: 'Ticket called successfully. Returns the updated ticket.',
  })
  @ApiResponse({ status: 404, description: 'Ticket not found. The ID does not exist.' })
  async llamarTurno(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Usuario,
  ) {
    const turno = await this.turnosLlegadaService.llamarTurno(id, user.id);
    return TurnoLlegadaAdapter.toResponse(turno);
  }

  @Patch(':id/attend')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Mark a ticket as Attended' })
  @ApiResponse({
    status: 200,
    description: 'Ticket attended successfully. Returns the updated ticket.',
  })
  @ApiResponse({ status: 404, description: 'Ticket not found. The ID does not exist.' })
  async atenderTurno(@Param('id', ParseUUIDPipe) id: string) {
    const turno = await this.turnosLlegadaService.atenderTurno(id);
    return TurnoLlegadaAdapter.toResponse(turno);
  }

  @Patch(':id/discard')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Discard a ticket (client did not show up)' })
  @ApiResponse({
    status: 200,
    description: 'Ticket discarded successfully. Returns the updated ticket.',
  })
  @ApiResponse({ status: 404, description: 'Ticket not found. The ID does not exist.' })
  async descartarTurno(@Param('id', ParseUUIDPipe) id: string) {
    const turno = await this.turnosLlegadaService.descartarTurno(id);
    return TurnoLlegadaAdapter.toResponse(turno);
  }
}
