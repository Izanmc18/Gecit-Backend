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
import { Public } from '../auth/decorators/public.decorator';
import { Auth, CurrentUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Users')
@Controller('users')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully. Returns the newly created user.' })
  @ApiResponse({ status: 400, description: 'Bad request. The input data is invalid.' })
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @CurrentUser() adminUser: any,
  ) {
    const ADMIN_ROLE_ID = 'e51b3a32-1111-4a3b-9a99-b1d5c7f8a121';
    const EMPLEADO_ROLE_ID = 'e51b3a32-2222-4a3b-9a99-b1d5c7f8a122';
    if (adminUser.rol?.nombreRol === ValidRoles.admin && adminUser.idEntidad) {
      createUsuarioDto.idEntidad = adminUser.idEntidad;
      createUsuarioDto.debeCambiarPassword = true;
    }
    else if (adminUser.rol?.nombreRol === ValidRoles.superadmin) {
      if (
        createUsuarioDto.idRol === ADMIN_ROLE_ID ||
        createUsuarioDto.idRol === EMPLEADO_ROLE_ID
      ) {
        createUsuarioDto.debeCambiarPassword = true;
      }
    }

    const usuario = await this.usuariosService.create(createUsuarioDto);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.admin)
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({ status: 200, description: 'Returns a list of all users successfully.' })
  @ApiResponse({ status: 404, description: 'Users not found in the system.' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() adminUser: any
  ) {
    const forcedIdEntidad = adminUser.rol?.nombreRol === 'Admin' ? adminUser.idEntidad : undefined;
    const usuarios = await this.usuariosService.findAll(paginationDto, forcedIdEntidad);
    return usuarios.map(UsuarioAdapter.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Returns the specified user successfully.' })
  @ApiResponse({ status: 404, description: 'User not found. The ID does not exist.' })
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuariosService.findOne(id);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.admin)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully. Returns the updated user.' })
  @ApiResponse({ status: 404, description: 'User not found. The ID does not exist.' })
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuario = await this.usuariosService.update(id, updateUsuarioDto);
    return UsuarioAdapter.toResponse(usuario);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found. The ID does not exist.' })
  async remove(@Param('id') id: string) {
    await this.usuariosService.remove(id);
    return { message: 'User deleted' };
  }
}
