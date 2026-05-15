
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Entidad } from '../entidades/entities/entidad.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { Sala } from '../salas/entities/sala.entity';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Cita } from '../citas/entities/cita.entity';
import { Tramite } from '../tramites/entities/tramite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entidad, Usuario, Rol, Sala, Mesa, Cita, Tramite]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
