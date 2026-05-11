import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('global')
  @Auth(ValidRoles.superadmin)
  @ApiOperation({ summary: 'Métricas globales del sistema (SuperAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'Global stats found successfully.',
  })
  async getGlobalStats() {
    return this.analyticsService.getGlobalStats();
  }

  @Get('heatmap')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Distribución de carga por horas' })
  async getHeatmap() {
    return this.analyticsService.getHeatmap();
  }

  @Get('entidad/:id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Métricas específicas de una entidad' })
  async getEntidadStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.analyticsService.getEntidadStats(id);
  }

  @Get('dashboard/:id')
  @Auth(ValidRoles.admin)
  @ApiOperation({
    summary: 'Resumen completo para el dashboard de administración',
  })
  async getDashboardSummary(@Param('id', ParseUUIDPipe) id: string) {
    return this.analyticsService.getDashboardSummary(id);
  }
}
