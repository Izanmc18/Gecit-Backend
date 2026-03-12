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

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRolDto: CreateRolDto) {
    const rol = await this.rolesService.create(createRolDto);
    return RolAdapter.toResponse(rol);
  }

  @Get()
  async findAll() {
    const roles = await this.rolesService.findAll();
    return RolAdapter.toResponseList(roles);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const rol = await this.rolesService.findOne(id);
    return RolAdapter.toResponse(rol);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    const rol = await this.rolesService.update(id, updateRolDto);
    return RolAdapter.toResponse(rol);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
