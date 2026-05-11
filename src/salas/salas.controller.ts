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
import { SalasService } from './salas.service';
import { CreateSalaDto, UpdateSalaDto } from './dto';
import { SalaAdapter } from './adapters/sala.adapter';
import { Auth, CurrentUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('rooms')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new room (Admin only)' })
  @ApiResponse({ status: 201, description: 'Room created successfully.' })
  async create(@Body() createSalaDto: CreateSalaDto) {
    const sala = await this.salasService.create(createSalaDto);
    return SalaAdapter.toResponse(sala);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({
    status: 201,
    description: 'Rooms found successfully.',
  })
  async findAll(@CurrentUser('idEntidad') idEntidad: string) {
    const salas = await this.salasService.findAll(idEntidad);
    return SalaAdapter.toResponseList(salas);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiResponse({
    status: 201,
    description: 'Room found successfully.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const sala = await this.salasService.findOne(id);
    return SalaAdapter.toResponse(sala);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a room' })
  @ApiResponse({
    status: 201,
    description: 'Room updated successfully.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSalaDto: UpdateSalaDto,
  ) {
    const sala = await this.salasService.update(id, updateSalaDto);
    return SalaAdapter.toResponse(sala);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({
    status: 201,
    description: 'Room deleted successfully.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.salasService.remove(id);
  }
}
