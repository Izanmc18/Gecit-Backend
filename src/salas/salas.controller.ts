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
import { Public } from '../auth/decorators/public.decorator';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Public()
  @Get('public/:idEntidad')
  @ApiOperation({ summary: 'Get all public rooms for an entity' })
  @ApiResponse({ status: 200, description: 'Returns a list of public rooms successfully.' })
  @ApiResponse({ status: 404, description: 'Entity not found. The ID does not exist.' })
  async findAllPublic(@Param('idEntidad', ParseUUIDPipe) idEntidad: string) {
    const salas = await this.salasService.findAll(idEntidad);
    return SalaAdapter.toResponseList(salas);
  }

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new room (Admin only)' })
  @ApiResponse({ status: 201, description: 'Room created successfully. Returns the new room.' })
  @ApiResponse({ status: 400, description: 'Bad request. The input data is invalid.' })
  async create(@Body() createSalaDto: CreateSalaDto) {
    const sala = await this.salasService.create(createSalaDto);
    return SalaAdapter.toResponse(sala);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all rooms successfully.',
  })
  async findAll(@CurrentUser('idEntidad') idEntidad: string) {
    const salas = await this.salasService.findAll(idEntidad);
    return SalaAdapter.toResponseList(salas);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified room successfully.',
  })
  @ApiResponse({ status: 404, description: 'Room not found. The ID does not exist.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const sala = await this.salasService.findOne(id);
    return SalaAdapter.toResponse(sala);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a room by ID' })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully. Returns the updated room.',
  })
  @ApiResponse({ status: 404, description: 'Room not found. The ID does not exist.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSalaDto: UpdateSalaDto,
  ) {
    const sala = await this.salasService.update(id, updateSalaDto);
    return SalaAdapter.toResponse(sala);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a room by ID' })
  @ApiResponse({
    status: 200,
    description: 'Room deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Room not found. The ID does not exist.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.salasService.remove(id);
  }
}
