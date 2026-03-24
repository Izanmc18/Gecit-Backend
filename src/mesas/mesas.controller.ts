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
import { MesasService } from './mesas.service';
import { CreateMesaDto, UpdateMesaDto } from './dto';
import { MesaAdapter } from './adapters/mesa.adapter';

@Controller('tables')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  async create(@Body() createMesaDto: CreateMesaDto) {
    const mesa = await this.mesasService.create(createMesaDto);
    return MesaAdapter.toResponse(mesa);
  }

  @Get()
  async findAll() {
    const mesas = await this.mesasService.findAll();
    return MesaAdapter.toResponseList(mesas);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const mesa = await this.mesasService.findOne(id);
    return MesaAdapter.toResponse(mesa);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    const mesa = await this.mesasService.update(id, updateMesaDto);
    return MesaAdapter.toResponse(mesa);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mesasService.remove(id);
  }
}
