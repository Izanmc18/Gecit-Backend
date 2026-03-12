import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OficinasController } from './oficinas.controller';
import { OficinasService } from './oficinas.service';
import { Oficina } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Oficina])],
  controllers: [OficinasController],
  providers: [OficinasService],
})
export class OficinasModule {}
