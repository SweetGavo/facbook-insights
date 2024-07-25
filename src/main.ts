import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {config} from "dotenv"
config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configBuilder = new DocumentBuilder()
    .setTitle(process.env.TITLE)
    .setDescription(process.env.DESCRIPTION)
    .setVersion(process.env.VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, configBuilder);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
