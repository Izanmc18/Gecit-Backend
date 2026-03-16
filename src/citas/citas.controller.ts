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
import { CitasService } from './citas.service';
import { CreateCitaDto, UpdateCitaDto } from './dto';
import { CitaAdapter } from './adapters/cita.adapter';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  async create(@Body() createCitaDto: CreateCitaDto) {
    const cita = await this.citasService.create(createCitaDto);
    return CitaAdapter.toResponse(cita);
  }

  @Get()
  async findAll() {
    const citas = await this.citasService.findAll();
    return CitaAdapter.toResponseList(citas);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const cita = await this.citasService.findOne(id);
    return CitaAdapter.toResponse(cita);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCitaDto: UpdateCitaDto,
  ) {
    const cita = await this.citasService.update(id, updateCitaDto);
    return CitaAdapter.toResponse(cita);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.citasService.remove(id);
  }
}
