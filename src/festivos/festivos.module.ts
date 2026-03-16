import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivosService } from './festivos.service';
import { FestivosController } from './festivos.controller';
import { Festivo } from './entities/festivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Festivo])],
  controllers: [FestivosController],
  providers: [FestivosService],
  exports: [TypeOrmModule, FestivosService],
})
export class FestivosModule {}
