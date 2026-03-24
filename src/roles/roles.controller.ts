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
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new role (Admin only)' })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  async create(@Body() createRolDto: CreateRolDto) {
    const rol = await this.rolesService.create(createRolDto);
    return RolAdapter.toResponse(rol);
  }

  @Get()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Get a list of all roles (Admin only)' })
  async findAll() {
    const roles = await this.rolesService.findAll();
    return RolAdapter.toResponseList(roles);
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Get one role by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const rol = await this.rolesService.findOne(id);
    return RolAdapter.toResponse(rol);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a role by ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    const rol = await this.rolesService.update(id, updateRolDto);
    return RolAdapter.toResponse(rol);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a role by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
