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

@Controller('oficinas')
export class OficinasController {
  constructor(private readonly oficinasService: OficinasService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createOficinaDto: CreateOficinaDto) {
    return this.oficinasService.create(createOficinaDto);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  findAll() {
    return this.oficinasService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.oficinasService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOficinaDto: UpdateOficinaDto,
  ) {
    return this.oficinasService.update(id, updateOficinaDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.oficinasService.remove(id);
  }
}
