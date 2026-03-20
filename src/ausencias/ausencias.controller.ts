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
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('ausencias')
export class AusenciasController {
  constructor(private readonly ausenciasService: AusenciasService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async create(@Body() createAusenciaDto: CreateAusenciaDto) {
    const ausencia = await this.ausenciasService.create(createAusenciaDto);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async findAll() {
    const ausencias = await this.ausenciasService.findAll();
    return AusenciaAdapter.toResponseList(ausencias);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const ausencia = await this.ausenciasService.findOne(id);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAusenciaDto: UpdateAusenciaDto,
  ) {
    const ausencia = await this.ausenciasService.update(id, updateAusenciaDto);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ausenciasService.remove(id);
  }
}
