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
import { CreateCitaDto, UpdateCitaDto } from './dto';
import { CitaAdapter } from './adapters/cita.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
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
    summary: 'Get a list of all appointments with search and pagination',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const { data, meta } = await this.citasService.findAll(paginationDto);
    return {
      data: CitaAdapter.toResponseList(data),
      meta,
    };
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get one appointment by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const cita = await this.citasService.findOne(id);
    return CitaAdapter.toResponse(cita);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Update an appointment by ID' })
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
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.citasService.remove(id);
  }
}
