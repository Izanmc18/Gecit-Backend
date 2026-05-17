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
import { FestivosService } from './festivos.service';
import { CreateFestivoDto, UpdateFestivoDto } from './dto';
import { FestivoAdapter } from './adapters/festivo.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Holidays')
@ApiBearerAuth()
@Controller('holidays')
export class FestivosController {
  constructor(private readonly festivosService: FestivosService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new holiday (Admin only)' })
  @ApiResponse({ status: 201, description: 'Holiday created successfully. Returns the new holiday.' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data.' })
  async create(@Body() createFestivoDto: CreateFestivoDto) {
    const festivo = await this.festivosService.create(createFestivoDto);
    return FestivoAdapter.toResponse(festivo);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get a list of all holidays' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all holidays successfully.',
  })
  async findAll() {
    const festivos = await this.festivosService.findAll();
    return FestivoAdapter.toResponseList(festivos);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  @ApiOperation({ summary: 'Get one holiday by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified holiday successfully.',
  })
  @ApiResponse({ status: 404, description: 'Holiday not found. The ID does not exist.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const festivo = await this.festivosService.findOne(id);
    return FestivoAdapter.toResponse(festivo);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a holiday by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Holiday updated successfully. Returns the updated holiday.',
  })
  @ApiResponse({ status: 404, description: 'Holiday not found. The ID does not exist.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFestivoDto: UpdateFestivoDto,
  ) {
    const festivo = await this.festivosService.update(id, updateFestivoDto);
    return FestivoAdapter.toResponse(festivo);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a holiday by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Holiday deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Holiday not found. The ID does not exist.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.festivosService.remove(id);
  }
}
