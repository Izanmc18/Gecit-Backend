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
import { HorariosService } from './horarios.service';
import { CreateHorarioDto, UpdateHorarioDto } from './dto';
import { HorarioAdapter } from './adapters/horario.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Schedules')
@ApiBearerAuth()
@Controller('schedules')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new schedule (Admin only)' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully.' })
  async create(@Body() createHorarioDto: CreateHorarioDto) {
    const horario = await this.horariosService.create(createHorarioDto);
    return HorarioAdapter.toResponse(horario);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a list of all schedules' })
  async findAll() {
    const horarios = await this.horariosService.findAll();
    return HorarioAdapter.toResponseList(horarios);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get one schedule by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const horario = await this.horariosService.findOne(id);
    return HorarioAdapter.toResponse(horario);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a schedule by ID (Admin only)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHorarioDto: UpdateHorarioDto,
  ) {
    const horario = await this.horariosService.update(id, updateHorarioDto);
    return HorarioAdapter.toResponse(horario);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a schedule by ID (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.horariosService.remove(id);
  }
}
