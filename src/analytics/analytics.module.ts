import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Entidad } from '../entidades/entities/entidad.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Cita } from '../citas/entities/cita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entidad, Usuario, Cita])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
