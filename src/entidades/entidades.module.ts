import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadesService } from './entidades.service';
import { EntidadesController } from './entidades.controller';
import { Entidad } from './entities/entidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entidad])],
  controllers: [EntidadesController],
  providers: [EntidadesService],
  exports: [EntidadesService],
})
export class EntidadesModule {}
