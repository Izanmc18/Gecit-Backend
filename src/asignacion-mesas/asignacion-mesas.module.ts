import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionMesasService } from './asignacion-mesas.service';
import { AsignacionMesasController } from './asignacion-mesas.controller';
import { AsignacionMesa } from './entities/asignacion-mesa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsignacionMesa])],
  controllers: [AsignacionMesasController],
  providers: [AsignacionMesasService],
  exports: [TypeOrmModule, AsignacionMesasService],
})
export class AsignacionMesasModule {}
