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
import { FestivosService } from './festivos.service';
import { CreateFestivoDto, UpdateFestivoDto } from './dto';
import { FestivoAdapter } from './adapters/festivo.adapter';

@Controller('holidays')
export class FestivosController {
  constructor(private readonly festivosService: FestivosService) {}

  @Post()
  async create(@Body() createFestivoDto: CreateFestivoDto) {
    const festivo = await this.festivosService.create(createFestivoDto);
    return FestivoAdapter.toResponse(festivo);
  }

  @Get()
  async findAll() {
    const festivos = await this.festivosService.findAll();
    return FestivoAdapter.toResponseList(festivos);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const festivo = await this.festivosService.findOne(id);
    return FestivoAdapter.toResponse(festivo);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFestivoDto: UpdateFestivoDto,
  ) {
    const festivo = await this.festivosService.update(id, updateFestivoDto);
    return FestivoAdapter.toResponse(festivo);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.festivosService.remove(id);
  }
}
