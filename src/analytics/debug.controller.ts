
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('debug-stats')
export class DebugController {
  @Get()
  @Public()
  getHello() {
    return { message: 'Debug controller is alive' };
  }
}
