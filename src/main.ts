import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference'
import { config as cfg } from 'dotenv';
import cookieParser from 'cookie-parser'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  cfg();
  const config = new DocumentBuilder()
  .setTitle('API for brsk')
  .setVersion('1.0')
  .build()

  const document = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  
  app.use(cookieParser());
  
  app.use(
    '/reference',
    apiReference({
    content: document
  }),
  )
  
  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
