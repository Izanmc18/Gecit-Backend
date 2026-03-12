import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OficinasModule } from './oficinas/oficinas.module';

@Module({
  imports: [
    // Carga las variables del .env de forma global en toda la aplicación
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM leyendo las variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // Solo en desarrollo: sincroniza el esquema automáticamente.
        // En producción debe ser false (usaremos migraciones).
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),

    OficinasModule,
  ],
})
export class AppModule {}
