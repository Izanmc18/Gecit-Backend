import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Auth } from '../auth/decorators';
import { Public } from '../auth/decorators/public.decorator';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('global')
  @Public()
  @ApiOperation({ summary: 'Get global system metrics (SuperAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'Returns global stats successfully.',
  })
  async getGlobalStats() {
    return this.analyticsService.getGlobalStats();
  }

  @Get('heatmap')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Get hourly load distribution heatmap' })
  @ApiResponse({ status: 200, description: 'Returns heatmap data successfully.' })
  async getHeatmap() {
    return this.analyticsService.getHeatmap();
  }

  @Get('entidad/:id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Get specific metrics for an entity' })
  @ApiResponse({ status: 200, description: 'Returns entity metrics successfully.' })
  @ApiResponse({ status: 404, description: 'Entity not found. The ID does not exist.' })
  async getEntidadStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.analyticsService.getEntidadStats(id);
  }

  @Get('dashboard/:id')
  @Auth(ValidRoles.admin)
  @ApiOperation({
    summary: 'Get complete summary for the admin dashboard',
  })
  @ApiResponse({ status: 200, description: 'Returns the dashboard summary successfully.' })
  @ApiResponse({ status: 404, description: 'Entity not found. The ID does not exist.' })
  async getDashboardSummary(@Param('id', ParseUUIDPipe) id: string) {
    return this.analyticsService.getDashboardSummary(id);
  }
}
