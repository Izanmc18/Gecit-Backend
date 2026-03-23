import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { AusenciasService } from './ausencias.service';
import { CreateAusenciaDto, UpdateAusenciaDto } from './dto';
import { AusenciaAdapter } from './adapters/ausencia.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
  async findAll(@Query() paginationDto: PaginationDto) {
    const { data, meta } = await this.ausenciasService.findAll(paginationDto);
    return {
      data: AusenciaAdapter.toResponseList(data),
      meta,
    };
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
