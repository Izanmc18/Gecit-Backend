import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const logger = new Logger('Bootstrap');

 
  app.setGlobalPrefix('api/v1');

 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

 
  app.useGlobalFilters(new AllExceptionsFilter());

 
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
