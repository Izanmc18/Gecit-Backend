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
import { HorariosService } from './horarios.service';
import { CreateHorarioDto, UpdateHorarioDto } from './dto';
import { HorarioAdapter } from './adapters/horario.adapter';

@Controller('schedules')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  async create(@Body() createHorarioDto: CreateHorarioDto) {
    const horario = await this.horariosService.create(createHorarioDto);
    return HorarioAdapter.toResponse(horario);
  }

  @Get()
  async findAll() {
    const horarios = await this.horariosService.findAll();
    return HorarioAdapter.toResponseList(horarios);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const horario = await this.horariosService.findOne(id);
    return HorarioAdapter.toResponse(horario);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHorarioDto: UpdateHorarioDto,
  ) {
    const horario = await this.horariosService.update(id, updateHorarioDto);
    return HorarioAdapter.toResponse(horario);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.horariosService.remove(id);
  }
}
