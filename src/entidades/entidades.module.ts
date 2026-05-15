import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadesService } from './entidades.service';
import { EntidadesController } from './entidades.controller';
import { Entidad } from './entities/entidad.entity';
import { Tramite } from '../tramites/entities/tramite.entity';
import { Competencia } from '../competencias/entities/competencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entidad, Tramite, Competencia])],
  controllers: [EntidadesController],
  providers: [EntidadesService],
  exports: [EntidadesService],
})
export class EntidadesModule {}
