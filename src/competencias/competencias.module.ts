import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetenciasService } from './competencias.service';
import { CompetenciasController } from './competencias.controller';
import { Competencia } from './entities/competencia.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competencia, Usuario])],
  controllers: [CompetenciasController],
  providers: [CompetenciasService],
  exports: [TypeOrmModule, CompetenciasService],
})
export class CompetenciasModule {}
