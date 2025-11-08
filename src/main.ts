import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  setupSwagger(app);
  await app.listen(port);
  console.log('🚀 Server ON: ', await app.getUrl());
  console.log(`🚀 Swagger: ${await app.getUrl()}/docs`);
}
bootstrap();
