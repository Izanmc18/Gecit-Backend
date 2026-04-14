import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosLlegadaService } from './turnos-llegada.service';
import { TurnosLlegadaController } from './turnos-llegada.controller';
import { TurnoLlegada } from './entities/turno-llegada.entity';
import { Cita } from '../citas/entities/cita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TurnoLlegada, Cita])],
  controllers: [TurnosLlegadaController],
  providers: [TurnosLlegadaService],
  exports: [TypeOrmModule, TurnosLlegadaService],
})
export class TurnosLlegadaModule {}
