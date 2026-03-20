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
import { RolesService } from './roles.service';
import { CreateRolDto, UpdateRolDto } from './dto';
import { RolAdapter } from './adapters/rol.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Auth(ValidRoles.admin)
  async create(@Body() createRolDto: CreateRolDto) {
    const rol = await this.rolesService.create(createRolDto);
    return RolAdapter.toResponse(rol);
  }

  @Get()
  @Auth(ValidRoles.admin)
  async findAll() {
    const roles = await this.rolesService.findAll();
    return RolAdapter.toResponseList(roles);
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const rol = await this.rolesService.findOne(id);
    return RolAdapter.toResponse(rol);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    const rol = await this.rolesService.update(id, updateRolDto);
    return RolAdapter.toResponse(rol);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
