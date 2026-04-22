import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // Permite cualquier origen en desarrollo (muy útil si el puerto de Angular cambia)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const logger = new Logger('Bootstrap');

  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api/v1');

  // Pipe global de validación estricta de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma el payload al tipo del DTO automáticamente
    }),
  );

  // Filtro global para estandarizar todas las respuestas de error
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('GECIT API')
    .setDescription('Documentación de la API del sistema GECIT')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Gecit Backend corriendo en: http://localhost:${port}/api/v1`);
  logger.log(`Swagger docs en: http://localhost:${port}/api/v1/docs`);
}

void bootstrap();
