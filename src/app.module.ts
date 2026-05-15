import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { EntidadesModule } from './entidades/entidades.module';
import { RolesModule } from './roles/roles.module';
import { TramitesModule } from './tramites/tramites.module';
import { SalasModule } from './salas/salas.module';
import { FestivosModule } from './festivos/festivos.module';
import { HorariosModule } from './horarios/horarios.module';
import { MesasModule } from './mesas/mesas.module';
import { AusenciasModule } from './ausencias/ausencias.module';
import { CitasModule } from './citas/citas.module';
import { AsignacionMesasModule } from './asignacion-mesas/asignacion-mesas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CompetenciasModule } from './competencias/competencias.module';
import { TurnosLlegadaModule } from './turnos-llegada/turnos-llegada.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const db = config.get<string>('DB_NAME');
        console.log(`HOT RELOAD TEST: Conectando a base de datos: ${db} en ${host}`);
        return {
          type: 'mysql',
          host: host,
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASS'),
          database: db,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public',
    }),

    EntidadesModule,
    RolesModule,
    TramitesModule,
    SalasModule,
    FestivosModule,
    HorariosModule,
    MesasModule,
    AusenciasModule,
    CitasModule,
    AsignacionMesasModule,
    UsuariosModule,
    AuthModule,
    CompetenciasModule,
    TurnosLlegadaModule,
    AnalyticsModule,
    MediaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
