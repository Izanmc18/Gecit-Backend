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
import { CitasService } from './citas.service';
import {
  CreateCitaDto,
  UpdateCitaDto,
  FilterCitaDto,
  SlotsFilterDto,
  ReasignarMasivoDto,
} from './dto';
import { CitaAdapter } from './adapters/cita.adapter';
import { Auth, CurrentUser } from '../auth/decorators';
import { Public } from '../auth/decorators/public.decorator';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully.',
  })
  async create(@Body() createCitaDto: CreateCitaDto) {
    const cita = await this.citasService.create(createCitaDto);
    return CitaAdapter.toResponse(cita);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({
    summary:
      'Get a list of all appointments with search, filters and pagination',
  })
  @ApiResponse({
    status: 201,
    description: 'Appointments found successfully.',
  })
  async findAll(
    @Query() filterDto: FilterCitaDto,
    @CurrentUser('idEntidad') idEntidad: string,
  ) {
    const { data, meta } = await this.citasService.findAll(
      filterDto,
      idEntidad,
    );
    return {
      data: CitaAdapter.toResponseList(data),
      meta,
    };
  }

  @Get('my-appointments')
  @Auth()
  @ApiOperation({ summary: 'Get appointments for the logged-in client by email' })
  @ApiResponse({ status: 200, description: 'Client appointments found.' })
  async getMyAppointments(@CurrentUser('email') email: string) {
    const citas = await this.citasService.findByClientEmail(email);
    return CitaAdapter.toResponseList(citas);
  }

  @Get('slots')
  @Public()
  @ApiOperation({
    summary: 'Obtener huecos disponibles para una fecha y trámite',
  })
  @ApiResponse({
    status: 201,
    description: 'Slots found successfully.',
  })
  async getDisponibilidad(@Query() slotsFilterDto: SlotsFilterDto) {
    return this.citasService.getDisponibilidad(slotsFilterDto);
  }

  @Post('reasignar-masivo')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Reasignar citas de un empleado a otro' })
  @ApiResponse({
    status: 201,
    description: 'Appointments reassigned successfully.',
  })
  async reasignarMasivo(@Body() reasignarDto: ReasignarMasivoDto) {
    return this.citasService.reasignarMasivo(reasignarDto);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get one appointment by ID' })
  @ApiResponse({
    status: 201,
    description: 'Appointment found successfully.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const cita = await this.citasService.findOne(id);
    return CitaAdapter.toResponse(cita);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Update an appointment by ID' })
  @ApiResponse({
    status: 201,
    description: 'Appointment updated successfully.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCitaDto: UpdateCitaDto,
  ) {
    const cita = await this.citasService.update(id, updateCitaDto);
    return CitaAdapter.toResponse(cita);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Delete an appointment by ID' })
  @ApiResponse({
    status: 201,
    description: 'Appointment deleted successfully.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.citasService.remove(id);
  }

  @Delete(':id/cancel')
  @Auth()
  @ApiOperation({ summary: 'Cancel (delete) own appointment as a client' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled and slot freed.' })
  async cancelMyAppointment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('email') email: string,
  ) {
    await this.citasService.cancelByClient(id, email);
    return { message: 'Cita cancelada correctamente' };
  }
}
