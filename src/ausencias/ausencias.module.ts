import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AusenciasService } from './ausencias.service';
import { AusenciasController } from './ausencias.controller';
import { Ausencia } from './entities/ausencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ausencia])],
  controllers: [AusenciasController],
  providers: [AusenciasService],
  exports: [TypeOrmModule, AusenciasService],
})
export class AusenciasModule {}
