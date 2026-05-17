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
import { Auth, CurrentUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Tables')
@ApiBearerAuth()
@Controller('tables')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new table (Admin only)' })
  @ApiResponse({ status: 201, description: 'Table created successfully. Returns the new table.' })
  @ApiResponse({ status: 400, description: 'Bad request. The input data is invalid.' })
  async create(@Body() createMesaDto: CreateMesaDto) {
    const mesa = await this.mesasService.create(createMesaDto);
    return MesaAdapter.toResponse(mesa);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get all tables' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all tables successfully.',
  })
  async findAll(@CurrentUser('idEntidad') idEntidad: string) {
    const mesas = await this.mesasService.findAll(idEntidad);
    return MesaAdapter.toResponseList(mesas);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a table by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified table successfully.',
  })
  @ApiResponse({ status: 404, description: 'Table not found. The ID does not exist.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const mesa = await this.mesasService.findOne(id);
    return MesaAdapter.toResponse(mesa);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a table by ID' })
  @ApiResponse({
    status: 200,
    description: 'Table updated successfully. Returns the updated table.',
  })
  @ApiResponse({ status: 404, description: 'Table not found. The ID does not exist.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    const mesa = await this.mesasService.update(id, updateMesaDto);
    return MesaAdapter.toResponse(mesa);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a table by ID' })
  @ApiResponse({
    status: 200,
    description: 'Table deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Table not found. The ID does not exist.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mesasService.remove(id);
  }
}
