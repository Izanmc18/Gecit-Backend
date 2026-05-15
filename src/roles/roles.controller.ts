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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRolDto, UpdateRolDto } from './dto';
import { RolAdapter } from './adapters/rol.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createRolDto: CreateRolDto) {
    const rol = await this.rolesService.create(createRolDto);
    return RolAdapter.toResponse(rol);
  }

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.admin)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  async findAll() {
    const roles = await this.rolesService.findAll();
    return RolAdapter.toResponseList(roles);
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.admin)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'Role found successfully.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const rol = await this.rolesService.findOne(id);
    return RolAdapter.toResponse(rol);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.admin)
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    const rol = await this.rolesService.update(id, updateRolDto);
    return RolAdapter.toResponse(rol);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
