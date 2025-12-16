import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(String(Config.api.base));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Voomp API')
    .setDescription('Equipe BugBusters - Hackathon Voomp 2025')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, for documentation purposes
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearerAuth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(Config.api.port);
}
bootstrap();
