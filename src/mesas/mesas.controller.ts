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
import { MesasService } from './mesas.service';
import { CreateMesaDto, UpdateMesaDto } from './dto';
import { MesaAdapter } from './adapters/mesa.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Tables')
@ApiBearerAuth()
@Controller('tables')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new table (Admin only)' })
  @ApiResponse({ status: 201, description: 'Table created successfully.' })
  async create(@Body() createMesaDto: CreateMesaDto) {
    const mesa = await this.mesasService.create(createMesaDto);
    return MesaAdapter.toResponse(mesa);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get all tables' })
  @ApiResponse({
    status: 201,
    description: 'Tables found successfully.',
  })
  async findAll() {
    const mesas = await this.mesasService.findAll();
    return MesaAdapter.toResponseList(mesas);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a table by ID' })
  @ApiResponse({
    status: 201,
    description: 'Table found successfully.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const mesa = await this.mesasService.findOne(id);
    return MesaAdapter.toResponse(mesa);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a table' })
  @ApiResponse({
    status: 201,
    description: 'Table updated successfully.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    const mesa = await this.mesasService.update(id, updateMesaDto);
    return MesaAdapter.toResponse(mesa);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a table' })
  @ApiResponse({
    status: 201,
    description: 'Table deleted successfully.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mesasService.remove(id);
  }
}
