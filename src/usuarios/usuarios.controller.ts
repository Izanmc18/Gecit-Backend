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
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { UsuarioAdapter } from './adapters/usuario.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Auth(ValidRoles.admin)
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.create(createUsuarioDto);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Get()
  @Auth(ValidRoles.admin)
  async findAll(@Query() paginationDto: PaginationDto) {
    const { data, meta } = await this.usuariosService.findAll(paginationDto);

    return {
      data: UsuarioAdapter.toResponseList(data),
      meta,
    };
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const usuario = await this.usuariosService.findOne(id);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuario = await this.usuariosService.update(id, updateUsuarioDto);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.remove(id);
  }
}
