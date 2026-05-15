import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosLlegadaService } from './turnos-llegada.service';
import { TurnosLlegadaController } from './turnos-llegada.controller';
import { TurnoLlegada } from './entities/turno-llegada.entity';
import { Cita } from '../citas/entities/cita.entity';
import { AsignacionMesa } from '../asignacion-mesas/entities/asignacion-mesa.entity';

import { Entidad } from '../entidades/entities/entidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TurnoLlegada, Cita, AsignacionMesa, Entidad])],
  controllers: [TurnosLlegadaController],
  providers: [TurnosLlegadaService],
  exports: [TypeOrmModule, TurnosLlegadaService],
})
export class TurnosLlegadaModule {}
