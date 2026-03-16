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
import { AusenciasService } from './ausencias.service';
import { CreateAusenciaDto, UpdateAusenciaDto } from './dto';
import { AusenciaAdapter } from './adapters/ausencia.adapter';

@Controller('ausencias')
export class AusenciasController {
  constructor(private readonly ausenciasService: AusenciasService) {}

  @Post()
  async create(@Body() createAusenciaDto: CreateAusenciaDto) {
    const ausencia = await this.ausenciasService.create(createAusenciaDto);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Get()
  async findAll() {
    const ausencias = await this.ausenciasService.findAll();
    return AusenciaAdapter.toResponseList(ausencias);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const ausencia = await this.ausenciasService.findOne(id);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAusenciaDto: UpdateAusenciaDto,
  ) {
    const ausencia = await this.ausenciasService.update(id, updateAusenciaDto);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ausenciasService.remove(id);
  }
}
