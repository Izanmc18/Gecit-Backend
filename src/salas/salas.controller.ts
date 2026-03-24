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
import { Auth } from '../auth/decorators';
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
  @ApiOperation({ summary: 'Get a list of all rooms' })
  async findAll() {
    const salas = await this.salasService.findAll();
    return SalaAdapter.toResponseList(salas);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get one room by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const sala = await this.salasService.findOne(id);
    return SalaAdapter.toResponse(sala);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a room by ID (Admin only)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSalaDto: UpdateSalaDto,
  ) {
    const sala = await this.salasService.update(id, updateSalaDto);
    return SalaAdapter.toResponse(sala);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a room by ID (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.salasService.remove(id);
  }
}
