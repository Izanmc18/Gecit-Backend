import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Entidad } from '../entidades/entities/entidad.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Cita } from '../citas/entities/cita.entity';
import { TurnoLlegada } from '../turnos-llegada/entities/turno-llegada.entity';
import { Tramite } from '../tramites/entities/tramite.entity';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Sala } from '../salas/entities/sala.entity';
import { Rol } from '../roles/entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entidad, Usuario, Cita, TurnoLlegada, Tramite, Mesa, Sala, Rol])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
