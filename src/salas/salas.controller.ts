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
import { SalasService } from './salas.service';
import { CreateSalaDto, UpdateSalaDto } from './dto';
import { SalaAdapter } from './adapters/sala.adapter';

@Controller('salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Post()
  async create(@Body() createSalaDto: CreateSalaDto) {
    const sala = await this.salasService.create(createSalaDto);
    return SalaAdapter.toResponse(sala);
  }

  @Get()
  async findAll() {
    const salas = await this.salasService.findAll();
    return SalaAdapter.toResponseList(salas);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const sala = await this.salasService.findOne(id);
    return SalaAdapter.toResponse(sala);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSalaDto: UpdateSalaDto,
  ) {
    const sala = await this.salasService.update(id, updateSalaDto);
    return SalaAdapter.toResponse(sala);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.salasService.remove(id);
  }
}
