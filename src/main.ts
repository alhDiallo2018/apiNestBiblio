import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('API pour gérer une bibliothèque en ligne')
    .setVersion('1.0')
    .addTag('users')
    .addTag('books')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
