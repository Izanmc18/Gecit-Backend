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
  ApiQuery,
} from '@nestjs/swagger';
import { TramitesService } from './tramites.service';
import { CreateTramiteDto, UpdateTramiteDto } from './dto';
import { TramiteAdapter } from './adapters/tramite.adapter';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Procedures')
@ApiBearerAuth()
@Controller('procedures')
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new procedure (Admin only)' })
  @ApiResponse({ status: 201, description: 'Procedure created successfully. Returns the new procedure.' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data.' })
  async create(@Body() createTramiteDto: CreateTramiteDto) {
    const tramite = await this.tramitesService.create(createTramiteDto);
    return TramiteAdapter.toResponse(tramite);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all procedures' })
  @ApiQuery({ name: 'idEntidad', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all procedures successfully.',
  })
  async findAll(@Query('idEntidad') idEntidad?: string) {
    const tramites = await this.tramitesService.findAll(idEntidad);
    return TramiteAdapter.toResponseList(tramites);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a procedure by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified procedure successfully.',
  })
  @ApiResponse({ status: 404, description: 'Procedure not found. The ID does not exist.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const tramite = await this.tramitesService.findOne(id);
    return TramiteAdapter.toResponse(tramite);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a procedure by ID' })
  @ApiResponse({
    status: 200,
    description: 'Procedure updated successfully. Returns the updated procedure.',
  })
  @ApiResponse({ status: 404, description: 'Procedure not found. The ID does not exist.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTramiteDto: UpdateTramiteDto,
  ) {
    const tramite = await this.tramitesService.update(id, updateTramiteDto);
    return TramiteAdapter.toResponse(tramite);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a procedure by ID' })
  @ApiResponse({
    status: 200,
    description: 'Procedure deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Procedure not found. The ID does not exist.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tramitesService.remove(id);
    return { message: 'Procedure deleted successfully' };
  }
}
