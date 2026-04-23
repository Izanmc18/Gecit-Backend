import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita } from './entities/cita.entity';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Festivo } from '../festivos/entities/festivo.entity';
import { Entidad } from '../entidades/entities/entidad.entity';
import { Horario } from '../horarios/entities/horario.entity';
import { Ausencia } from '../ausencias/entities/ausencia.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Tramite } from '../tramites/entities/tramite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cita,
      Mesa,
      Festivo,
      Entidad,
      Horario,
      Ausencia,
      Usuario,
      Tramite,
    ]),
  ],
  controllers: [CitasController],
  providers: [CitasService],
  exports: [TypeOrmModule, CitasService],
})
export class CitasModule {}
