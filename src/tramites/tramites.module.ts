import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TramitesService } from './tramites.service';
import { TramitesController } from './tramites.controller';
import { Tramite } from './entities/tramite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tramite])],
  controllers: [TramitesController],
  providers: [TramitesService],
  exports: [TypeOrmModule, TramitesService],
})
export class TramitesModule {}
