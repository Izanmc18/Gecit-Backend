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
import { CitasService } from './citas.service';
import { CreateCitaDto, UpdateCitaDto } from './dto';
import { CitaAdapter } from './adapters/cita.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async create(@Body() createCitaDto: CreateCitaDto) {
    const cita = await this.citasService.create(createCitaDto);
    return CitaAdapter.toResponse(cita);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { data, meta } = await this.citasService.findAll(paginationDto);
    return {
      data: CitaAdapter.toResponseList(data),
      meta,
    };
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const cita = await this.citasService.findOne(id);
    return CitaAdapter.toResponse(cita);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCitaDto: UpdateCitaDto,
  ) {
    const cita = await this.citasService.update(id, updateCitaDto);
    return CitaAdapter.toResponse(cita);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.citasService.remove(id);
  }
}
