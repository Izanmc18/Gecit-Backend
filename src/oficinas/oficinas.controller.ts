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
import { OficinasService } from './oficinas.service';
import { CreateOficinaDto, UpdateOficinaDto } from './dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { OficinaAdapter } from './adapters';

@Controller('oficinas')
export class OficinasController {
  constructor(private readonly oficinasService: OficinasService) {}

  @Post()
  @Auth(ValidRoles.admin)
  async create(@Body() createOficinaDto: CreateOficinaDto) {
    const oficina = await this.oficinasService.create(createOficinaDto);
    return OficinaAdapter.toResponse(oficina);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async findAll() {
    const oficinas = await this.oficinasService.findAll();
    return OficinaAdapter.toResponseList(oficinas);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const oficina = await this.oficinasService.findOne(id);
    return OficinaAdapter.toResponse(oficina);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOficinaDto: UpdateOficinaDto,
  ) {
    const oficina = await this.oficinasService.update(id, updateOficinaDto);
    return OficinaAdapter.toResponse(oficina);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.oficinasService.remove(id);
  }
}
