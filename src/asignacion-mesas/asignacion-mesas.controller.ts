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
import { AsignacionMesasService } from './asignacion-mesas.service';
import { CreateAsignacionMesaDto, UpdateAsignacionMesaDto } from './dto';
import { AsignacionMesaAdapter } from './adapters/asignacion-mesa.adapter';

@Controller('asignacion-mesas')
export class AsignacionMesasController {
  constructor(
    private readonly asignacionMesasService: AsignacionMesasService,
  ) {}

  @Post()
  async create(@Body() createAsignacionMesaDto: CreateAsignacionMesaDto) {
    const asignacion = await this.asignacionMesasService.create(
      createAsignacionMesaDto,
    );
    return AsignacionMesaAdapter.toResponse(asignacion);
  }

  @Get()
  async findAll() {
    const asignaciones = await this.asignacionMesasService.findAll();
    return AsignacionMesaAdapter.toResponseList(asignaciones);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const asignacion = await this.asignacionMesasService.findOne(id);
    return AsignacionMesaAdapter.toResponse(asignacion);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAsignacionMesaDto: UpdateAsignacionMesaDto,
  ) {
    const asignacion = await this.asignacionMesasService.update(
      id,
      updateAsignacionMesaDto,
    );
    return AsignacionMesaAdapter.toResponse(asignacion);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.asignacionMesasService.remove(id);
  }
}
