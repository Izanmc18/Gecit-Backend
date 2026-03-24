import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AusenciasService } from './ausencias.service';
import { CreateAusenciaDto, UpdateAusenciaDto } from './dto';
import { AusenciaAdapter } from './adapters/ausencia.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Absences')
@ApiBearerAuth()
@Controller('absences')
export class AusenciasController {
  constructor(private readonly ausenciasService: AusenciasService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Create a new absence request' })
  @ApiResponse({
    status: 201,
    description: 'Absence request created successfully.',
  })
  async create(@Body() createAusenciaDto: CreateAusenciaDto) {
    const ausencia = await this.ausenciasService.create(createAusenciaDto);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a list of all absence requests' })
  async findAll(@Query() paginationDto: PaginationDto) {
    const { data, meta } = await this.ausenciasService.findAll(paginationDto);
    return {
      data: AusenciaAdapter.toResponseList(data),
      meta,
    };
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get one absence request by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const ausencia = await this.ausenciasService.findOne(id);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Update an absence request by ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAusenciaDto: UpdateAusenciaDto,
  ) {
    const ausencia = await this.ausenciasService.update(id, updateAusenciaDto);
    return AusenciaAdapter.toResponse(ausencia);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Delete an absence request by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ausenciasService.remove(id);
  }
}
