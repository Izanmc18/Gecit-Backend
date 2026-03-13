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
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { UsuarioAdapter } from './adapters/usuario.adapter';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.create(createUsuarioDto);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Get()
  async findAll() {
    const usuarios = await this.usuariosService.findAll();
    return UsuarioAdapter.toResponseList(usuarios);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const usuario = await this.usuariosService.findOne(id);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuario = await this.usuariosService.update(id, updateUsuarioDto);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.remove(id);
  }
}
