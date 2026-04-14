/* eslint-disable @typescript-eslint/unbound-method */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UsuarioAdapter } from './adapters/usuario.adapter';

@ApiTags('Users')
@Controller('users')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.create(createUsuarioDto);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @ApiResponse({ status: 404, description: 'Users not found.' })
  async findAll(@Query() paginationDto: PaginationDto) {
    const usuarios = await this.usuariosService.findAll(paginationDto);
    return usuarios.map(UsuarioAdapter.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuariosService.findOne(id);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuario = await this.usuariosService.update(id, updateUsuarioDto);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string) {
    await this.usuariosService.remove(id);
    return { message: 'User deleted' };
  }
}
