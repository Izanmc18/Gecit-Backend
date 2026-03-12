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
import { TramitesService } from './tramites.service';
import { CreateTramiteDto, UpdateTramiteDto } from './dto';
import { TramiteAdapter } from './adapters/tramite.adapter';

@Controller('tramites')
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Post()
  async create(@Body() createTramiteDto: CreateTramiteDto) {
    const tramite = await this.tramitesService.create(createTramiteDto);
    return TramiteAdapter.toResponse(tramite);
  }

  @Get()
  async findAll() {
    const tramites = await this.tramitesService.findAll();
    return TramiteAdapter.toResponseList(tramites);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const tramite = await this.tramitesService.findOne(id);
    return TramiteAdapter.toResponse(tramite);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTramiteDto: UpdateTramiteDto,
  ) {
    const tramite = await this.tramitesService.update(id, updateTramiteDto);
    return TramiteAdapter.toResponse(tramite);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tramitesService.remove(id);
  }
}
